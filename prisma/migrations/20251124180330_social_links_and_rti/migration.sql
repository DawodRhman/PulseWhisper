-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SnapshotModule" ADD VALUE 'SETTINGS';
ALTER TYPE "SnapshotModule" ADD VALUE 'SOCIAL_LINKS';
ALTER TYPE "SnapshotModule" ADD VALUE 'RIGHT_TO_INFORMATION';

-- AlterTable
ALTER TABLE "RtiDocument" ADD COLUMN     "docType" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);
