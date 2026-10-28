-- Additive Website Copy Feedback storage. Run as yealth_forms_owner.
-- No reservation tables, delivery triggers, credentials or grants are changed.
CREATE TABLE IF NOT EXISTS forms.website_feedback (
 id uuid PRIMARY KEY,
 payload_hash text NOT NULL CHECK(payload_hash ~ '^[a-f0-9]{64}$'),
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS forms.website_feedback_limits (
 key text NOT NULL,
 window_start timestamptz NOT NULL,
 attempts integer NOT NULL,
 PRIMARY KEY(key,window_start)
);
REVOKE ALL ON forms.website_feedback, forms.website_feedback_limits FROM PUBLIC;
CREATE OR REPLACE FUNCTION forms.website_feedback_rate_limit(p_key text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE w timestamptz := to_timestamp(floor(extract(epoch FROM clock_timestamp())/900)*900); n integer; g integer;
BEGIN
 IF p_key IS NULL OR p_key !~ '^[a-f0-9]{64}$' THEN RETURN false; END IF;
 DELETE FROM forms.website_feedback_limits WHERE window_start < w - interval '1 day';
 INSERT INTO forms.website_feedback_limits VALUES ('global',w,1)
 ON CONFLICT(key,window_start) DO UPDATE SET attempts=website_feedback_limits.attempts+1 RETURNING attempts INTO g;
 INSERT INTO forms.website_feedback_limits VALUES (p_key,w,1)
 ON CONFLICT(key,window_start) DO UPDATE SET attempts=website_feedback_limits.attempts+1 RETURNING attempts INTO n;
 RETURN n <= 40 AND g <= 1000;
END; $$;
CREATE OR REPLACE FUNCTION forms.save_website_feedback(p_id uuid,p_hash text,p jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE previous text; k text; v text;
BEGIN
 IF p_id IS NULL OR p_hash IS NULL OR p_hash !~ '^[a-f0-9]{64}$' OR jsonb_typeof(p) IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 IF (SELECT count(*) FROM jsonb_object_keys(p)) <> 8 OR NOT p ?& ARRAY['pagesRead','membershipUnderstanding','agribusinessUnderstanding','membershipRequired','clarity','confusing','unanswered','improvement'] THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 IF jsonb_typeof(p->'pagesRead') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 IF jsonb_array_length(p->'pagesRead') NOT BETWEEN 1 AND 3 OR EXISTS(SELECT 1 FROM jsonb_array_elements(p->'pagesRead') a WHERE jsonb_typeof(a) <> 'string' OR a #>> '{}' NOT IN ('Homepage','Membership','Agribusiness')) OR (SELECT count(DISTINCT a) FROM jsonb_array_elements(p->'pagesRead') a) <> jsonb_array_length(p->'pagesRead') THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 FOREACH k IN ARRAY ARRAY['membershipUnderstanding','agribusinessUnderstanding','confusing','unanswered','improvement'] LOOP
  IF jsonb_typeof(p->k) IS DISTINCT FROM 'string' THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
  v:=p->>k;
  IF length(v)> (CASE WHEN k IN ('membershipUnderstanding','agribusinessUnderstanding') THEN 1200 ELSE 2000 END) OR (k IN ('membershipUnderstanding','agribusinessUnderstanding') AND length(btrim(v))=0) OR v ~ '[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]' THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 END LOOP;
 IF p->>'membershipRequired' IS NULL OR p->>'membershipRequired' NOT IN ('Yes','No','Not sure','I didn’t read this information.') THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 IF jsonb_typeof(p->'clarity') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 IF (SELECT count(*) FROM jsonb_object_keys(p->'clarity'))<>3 OR NOT (p->'clarity') ?& ARRAY['Homepage','Membership','Agribusiness'] THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 FOREACH k IN ARRAY ARRAY['Homepage','Membership','Agribusiness'] LOOP
  IF jsonb_typeof(p->'clarity'->k) IS DISTINCT FROM 'string' OR p->'clarity'->>k NOT IN ('Very unclear','Somewhat unclear','Neither clear nor unclear','Somewhat clear','Very clear','I didn’t read this page.') THEN RAISE EXCEPTION 'INVALID_FEEDBACK'; END IF;
 END LOOP;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_id::text,0));
 SELECT payload_hash INTO previous FROM forms.website_feedback WHERE id=p_id;
 IF FOUND THEN
  IF previous <> p_hash THEN RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT'; END IF;
  RETURN p_id;
 END IF;
 INSERT INTO forms.website_feedback(id,payload_hash,payload) VALUES(p_id,p_hash,p);
 RETURN p_id;
END; $$;
REVOKE ALL ON FUNCTION forms.website_feedback_rate_limit(text), forms.save_website_feedback(uuid,text,jsonb) FROM PUBLIC;


