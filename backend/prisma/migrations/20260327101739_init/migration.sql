/*
  Warnings:

  - You are about to drop the column `status` on the `domains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "domains" DROP COLUMN "status",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "DomainStatus";
