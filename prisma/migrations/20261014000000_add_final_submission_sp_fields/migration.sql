-- Add final-phase file columns for SPC finals (mockup, statement letter,
-- infographic, logbook). NEC finals reuse the existing pitchDeckUrl + posterUrl.
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "mockupUrl" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "statementUrl" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "infographicUrl" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "logbookUrl" TEXT;
