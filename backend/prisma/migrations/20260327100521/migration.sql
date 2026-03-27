/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `DomainStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DomainStatus_new" AS ENUM ('PENDING', 'VERIFIED', 'DELETED');
ALTER TABLE "public"."domains" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "domains" ALTER COLUMN "status" TYPE "DomainStatus_new" USING ("status"::text::"DomainStatus_new");
ALTER TYPE "DomainStatus" RENAME TO "DomainStatus_old";
ALTER TYPE "DomainStatus_new" RENAME TO "DomainStatus";
DROP TYPE "public"."DomainStatus_old";
ALTER TABLE "domains" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateIndex
CREATE INDEX "domains_website_id_custom_idx" ON "domains"("website_id", "custom");
