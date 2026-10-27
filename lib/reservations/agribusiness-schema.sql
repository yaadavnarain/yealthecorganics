-- Additive migration in the existing yealth-forms database. No new credentials.
-- Grants below require explicit approval before execution.
BEGIN;
CREATE OR REPLACE FUNCTION forms.agribusiness_rate_limit(p_key text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE b bigint := floor(extract(epoch FROM clock_timestamp()) / 900); n integer; total integer;
BEGIN
  IF p_key !~ '^[a-f0-9]{64}$' THEN RETURN false; END IF;
  DELETE FROM forms.rate_buckets WHERE bucket < b - 8;
  INSERT INTO forms.rate_buckets VALUES (b,'agribusiness-global',1)
    ON CONFLICT (bucket,key) DO UPDATE SET attempts=least(forms.rate_buckets.attempts+1,1001)
    RETURNING attempts INTO total;
  IF total > 1000 THEN RETURN false; END IF;
  INSERT INTO forms.rate_buckets VALUES (b,'agribusiness:'||p_key,1)
    ON CONFLICT (bucket,key) DO UPDATE SET attempts=least(forms.rate_buckets.attempts+1,41)
    RETURNING attempts INTO n;
  RETURN n <= 40;
END $$;
CREATE OR REPLACE FUNCTION forms.save_agribusiness(p_request uuid,p_hash text,p_contact text,p_payload jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,forms AS $$
DECLARE receipt forms.receipts; result uuid;
BEGIN
  IF p_request IS NULL OR p_hash IS NULL OR p_contact IS NULL OR p_payload IS NULL
    OR p_hash !~ '^[a-f0-9]{64}$' OR p_contact !~ '^[a-f0-9]{64}$'
    OR jsonb_typeof(p_payload) <> 'object' OR length(p_payload::text)>8192
    OR NOT (p_payload ?& ARRAY['firstName','lastName','email','phone','address','contribution'])
    OR (p_payload - ARRAY['firstName','lastName','email','phone','address','contribution']) <> '{}'::jsonb
    OR jsonb_typeof(p_payload->'contribution') <> 'number'
    OR p_payload->>'contribution' NOT IN ('1500','3000','4500')
    OR jsonb_typeof(p_payload->'firstName') <> 'string' OR length(p_payload->>'firstName') NOT BETWEEN 1 AND 80
    OR jsonb_typeof(p_payload->'lastName') <> 'string' OR length(p_payload->>'lastName') NOT BETWEEN 1 AND 80
    OR jsonb_typeof(p_payload->'email') <> 'string' OR length(p_payload->>'email') NOT BETWEEN 3 AND 254
    OR jsonb_typeof(p_payload->'phone') <> 'string' OR p_payload->>'phone' !~ '^\+?[0-9]{7,15}$'
    OR jsonb_typeof(p_payload->'address') <> 'string' OR length(p_payload->>'address') NOT BETWEEN 10 AND 500 THEN
    RAISE EXCEPTION 'INVALID_SUBMISSION';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('agribusiness-request:'||p_request::text,0));
  SELECT * INTO receipt FROM forms.receipts WHERE form_type='agribusiness-reservation' AND request_key=p_request;
  IF FOUND THEN
    IF receipt.payload_hash <> p_hash THEN RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT'; END IF;
    RETURN receipt.submission_id;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('agribusiness-contact:'||p_contact,0));
  SELECT id INTO result FROM forms.submissions WHERE form_type='agribusiness-reservation' AND contact_hash=p_contact;
  IF result IS NULL THEN
    INSERT INTO forms.submissions(form_type,contact_hash,payload)
      VALUES ('agribusiness-reservation',p_contact,p_payload) RETURNING id INTO result;
  END IF;
  INSERT INTO forms.receipts(form_type,request_key,payload_hash,submission_id)
    VALUES ('agribusiness-reservation',p_request,p_hash,result);
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION forms.agribusiness_rate_limit(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION forms.save_agribusiness(uuid,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION forms.agribusiness_rate_limit(text) TO membership_ingest;
GRANT EXECUTE ON FUNCTION forms.save_agribusiness(uuid,text,text,jsonb) TO membership_ingest;
COMMIT;
