/*
  Warnings:

  - You are about to drop the column `isVerified` on the `domains` table. All the data in the column will be lost.
  - The `status` column on the `domains` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "domains" DROP COLUMN "isVerified",
DROP COLUMN "status",
ADD COLUMN     "status" "DomainStatus" NOT NULL DEFAULT 'PENDING';
