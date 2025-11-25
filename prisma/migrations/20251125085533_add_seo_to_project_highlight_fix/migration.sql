-- AlterEnum
ALTER TYPE "SnapshotModule" ADD VALUE 'CONTACT';

-- AlterTable
ALTER TABLE "NewsTag" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProjectHighlight" ADD COLUMN     "seoId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectHighlight" ADD CONSTRAINT "ProjectHighlight_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "SeoMeta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
