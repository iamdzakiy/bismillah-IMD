-- =============================================================================
-- IMD 2026 — Supabase hardening + finalist phase sync
-- Run ONCE in Supabase Dashboard -> SQL Editor (as the default `postgres` role).
--
-- Why this is safe for the app: the Next.js app talks to Postgres through
-- Prisma using DATABASE_URL (the `postgres` role, which owns the tables and
-- bypasses RLS) and to Storage through the service_role key. Nothing in the
-- app uses the anon/authenticated keys, so locking those roles out does not
-- break any feature — it only closes the public REST API (PostgREST) that
-- would otherwise expose tables such as "User" (emails, password hashes,
-- realPassword) to anyone who has the project URL + anon key.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Enable RLS on every table in `public` and remove anon/authenticated access.
--    With RLS on and no policies, the REST API returns nothing to those roles.
-- -----------------------------------------------------------------------------
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', r.tablename);
  END LOOP;
END $$;

-- Future tables created by Prisma migrations should not be exposed either.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

-- Check: every row should show rowsecurity = true
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY 1;

-- -----------------------------------------------------------------------------
-- 2) Finalists: mark registration.currentPhase = 'FINAL' for the official list.
--    Access itself is enforced in code (src/lib/final.ts); this keeps the
--    admin panel / Google Sheet phase column consistent.
--    Names are matched ignoring case, spaces and punctuation, per track.
-- -----------------------------------------------------------------------------
CREATE TEMP TABLE finalists(track text, name text);
INSERT INTO finalists VALUES
  ('SPC','B-OILOGY'),('SPC','EDISAL'),('SPC','BIO_HL'),('SPC','IWAK TEAM'),('SPC','Wowokdetok'),
  ('NEC','MGPG'),('NEC','Kurang Lebih Begitu'),('NEC','Tim mi Time'),('NEC','Reza Traktir Makan'),
  ('NEC','Ochim'),('NEC','RAKIT KARYA'),('NEC','Antek-Antek Asing'),('NEC','WeLoveBuGiyo'),
  ('NEC','Genova'),('NEC','2MatchCulture');

-- 2a) PREVIEW — every finalist should appear with a team_id. A NULL team_id
--     means the name in the DB is spelled differently: fix it in
--     src/lib/final.ts (FINALIST_TEAMS) and in this list.
SELECT f.track, f.name AS finalist, t.id AS team_id, t."teamName", r."currentPhase"
FROM finalists f
LEFT JOIN "Team" t
  ON t."competitionType"::text = f.track
 AND lower(regexp_replace(t."teamName", '[^A-Za-z0-9]', '', 'g'))
   = lower(regexp_replace(f.name,       '[^A-Za-z0-9]', '', 'g'))
LEFT JOIN "Registration" r ON r."teamId" = t.id
ORDER BY f.track, f.name;

-- 2b) APPLY
UPDATE "Registration" r
SET "currentPhase" = 'FINAL', "updatedAt" = now()
FROM "Team" t, finalists f
WHERE r."teamId" = t.id
  AND t."competitionType"::text = f.track
  AND lower(regexp_replace(t."teamName", '[^A-Za-z0-9]', '', 'g'))
    = lower(regexp_replace(f.name,       '[^A-Za-z0-9]', '', 'g'))
  AND r."currentPhase" <> 'FINAL';

-- -----------------------------------------------------------------------------
-- 3) Storage: uploads go through the server (service_role / signed upload
--    URLs), so anon/authenticated must NOT be able to write to the bucket.
--    List current policies on storage.objects:
-- -----------------------------------------------------------------------------
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';

-- If the list above contains any INSERT / UPDATE / DELETE / ALL policy for
-- roles {public}, {anon} or {authenticated} on the "submissions" bucket,
-- drop it (replace the name):
--   DROP POLICY "<policy name>" ON storage.objects;
-- Public READ of the bucket can stay (stored links are public URLs).
-- Signed upload URLs keep working without any storage policy.
