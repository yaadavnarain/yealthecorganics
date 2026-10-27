-- Run privately as the owner of the dedicated yealth-forms database.
-- The website role can execute these two membership functions, never read records.
BEGIN;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA IF NOT EXISTS forms;
REVOKE ALL ON SCHEMA forms FROM PUBLIC;
CREATE TABLE IF NOT EXISTS forms.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL,
  contact_hash text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_type, contact_hash)
);
CREATE TABLE IF NOT EXISTS forms.receipts (
  form_type text NOT NULL,
  request_key uuid NOT NULL,
  payload_hash text NOT NULL,
  submission_id uuid NOT NULL REFERENCES forms.submissions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (form_type, request_key)
);
CREATE TABLE IF NOT EXISTS forms.rate_buckets (
  bucket bigint NOT NULL, key text NOT NULL, attempts integer NOT NULL,
  PRIMARY KEY (bucket, key)
);
CREATE OR REPLACE FUNCTION forms.membership_rate_limit(p_key text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE b bigint := floor(extract(epoch FROM clock_timestamp()) / 900); n integer; total integer;
BEGIN
  IF p_key !~ '^[a-f0-9]{64}$' THEN RETURN false; END IF;
  DELETE FROM forms.rate_buckets WHERE bucket < b - 8;
  INSERT INTO forms.rate_buckets VALUES (b,'membership-global',1)
    ON CONFLICT (bucket,key) DO UPDATE SET attempts=least(forms.rate_buckets.attempts+1,1001)
    RETURNING attempts INTO total;
  IF total > 1000 THEN RETURN false; END IF;
  INSERT INTO forms.rate_buckets VALUES (b,p_key,1)
    ON CONFLICT (bucket,key) DO UPDATE SET attempts=least(forms.rate_buckets.attempts+1,41)
    RETURNING attempts INTO n;
  RETURN n <= 40;
END $$;
CREATE OR REPLACE FUNCTION forms.save_membership(p_request uuid,p_hash text,p_contact text,p_payload jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE receipt forms.receipts; result uuid;
BEGIN
  IF p_hash !~ '^[a-f0-9]{64}$' OR p_contact !~ '^[a-f0-9]{64}$'
    OR jsonb_typeof(p_payload) <> 'object' OR length(p_payload::text)>8192
    OR jsonb_array_length(p_payload->'ranking') <> 10
    OR NOT (p_payload ?& ARRAY['firstName','lastName','email','phone','address','ranking']) THEN
    RAISE EXCEPTION 'INVALID_SUBMISSION';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('membership-request:'||p_request::text,0));
  SELECT * INTO receipt FROM forms.receipts WHERE form_type='membership-reservation' AND request_key=p_request;
  IF FOUND THEN
    IF receipt.payload_hash <> p_hash THEN RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT'; END IF;
    RETURN receipt.submission_id;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('membership-contact:'||p_contact,0));
  SELECT id INTO result FROM forms.submissions WHERE form_type='membership-reservation' AND contact_hash=p_contact;
  IF result IS NULL THEN
    INSERT INTO forms.submissions(form_type,contact_hash,payload)
      VALUES ('membership-reservation',p_contact,p_payload) RETURNING id INTO result;
  END IF;
  INSERT INTO forms.receipts(form_type,request_key,payload_hash,submission_id)
    VALUES ('membership-reservation',p_request,p_hash,result);
  RETURN result;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA forms FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA forms FROM PUBLIC;
-- Create membership_ingest separately with a generated secret; never commit it.
GRANT USAGE ON SCHEMA forms TO membership_ingest;
GRANT EXECUTE ON FUNCTION forms.membership_rate_limit(text) TO membership_ingest;
GRANT EXECUTE ON FUNCTION forms.save_membership(uuid,text,text,jsonb) TO membership_ingest;
COMMIT;
