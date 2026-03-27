/*
  Warnings:

  - You are about to drop the column `type` on the `domains` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `domains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "domains" DROP COLUMN "type",
DROP COLUMN "user_id",
ADD COLUMN     "custom" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "DomainType";
