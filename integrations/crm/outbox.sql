-- REVIEW ONLY: no migration/grant executed. Run only after explicit access approval.
BEGIN;
CREATE TABLE forms.delivery_outbox (
 submission_id uuid PRIMARY KEY REFERENCES forms.submissions(id),
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sent','review')),
 attempts integer NOT NULL DEFAULT 0, next_attempt timestamptz NOT NULL DEFAULT now(),
 lease uuid, lease_until timestamptz
);
REVOKE ALL ON forms.delivery_outbox FROM PUBLIC,membership_ingest;
CREATE FUNCTION forms.enqueue_delivery() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
BEGIN
 IF NEW.form_type IN ('membership-reservation','agribusiness-reservation') THEN
   INSERT INTO forms.delivery_outbox(submission_id) VALUES(NEW.id) ON CONFLICT DO NOTHING;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER native_delivery AFTER INSERT ON forms.submissions FOR EACH ROW EXECUTE FUNCTION forms.enqueue_delivery();
-- Only new rows enqueue. Existing records, including synthetic tests, are NOT backfilled.
CREATE FUNCTION forms.claim_deliveries(p_limit integer)
RETURNS TABLE(id uuid,lease uuid,event jsonb) LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
 WITH picked AS (SELECT o.submission_id FROM forms.delivery_outbox o
 WHERE o.state='pending' AND o.next_attempt<=now() AND (o.lease_until IS NULL OR o.lease_until<now())
 ORDER BY o.next_attempt LIMIT least(greatest(p_limit,1),10) FOR UPDATE SKIP LOCKED),
 claimed AS (UPDATE forms.delivery_outbox o SET lease=gen_random_uuid(),lease_until=now()+interval '5 minutes',attempts=attempts+1
 FROM picked p WHERE o.submission_id=p.submission_id RETURNING o.submission_id,o.lease)
 SELECT c.submission_id,c.lease,jsonb_build_object('id',s.id,'form',s.form_type,'createdAt',s.created_at,'payload',s.payload)
 FROM claimed c JOIN forms.submissions s ON s.id=c.submission_id;
$$;
CREATE FUNCTION forms.finish_delivery(p_id uuid,p_lease uuid,p_result text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
BEGIN
 IF p_result NOT IN ('retry','sent','review') OR p_result IS NULL THEN RAISE EXCEPTION 'INVALID_RESULT'; END IF;
 UPDATE forms.delivery_outbox SET state=CASE WHEN p_result='retry' AND attempts>=12 THEN 'review' WHEN p_result='retry' THEN 'pending' ELSE p_result END,
 next_attempt=now()+make_interval(secs=>least(86400,60*power(2,least(attempts,10)))::integer),lease=NULL,lease_until=NULL
 WHERE submission_id=p_id AND lease=p_lease AND lease_until>now();
 IF NOT FOUND THEN RAISE EXCEPTION 'LEASE_EXPIRED'; END IF;
END $$;
REVOKE ALL ON FUNCTION forms.enqueue_delivery(),forms.claim_deliveries(integer),forms.finish_delivery(uuid,uuid,text) FROM PUBLIC,membership_ingest;
-- Create dedicated forms_delivery role/credential separately after approval; do NOT use owner URL.
-- GRANT USAGE ON SCHEMA forms TO forms_delivery;
-- GRANT EXECUTE ON FUNCTION forms.claim_deliveries(integer),forms.finish_delivery(uuid,uuid,text) TO forms_delivery;
COMMIT;
