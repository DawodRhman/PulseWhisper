-- Add navbar metadata to pages without disturbing existing data
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "navLabel" TEXT;
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "navGroup" TEXT;
