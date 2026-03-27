/*
  Warnings:

  - You are about to drop the column `hostname` on the `domains` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `domains` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `domains` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "domains_hostname_idx";

-- DropIndex
DROP INDEX "domains_hostname_key";

-- AlterTable
ALTER TABLE "domains" DROP COLUMN "hostname",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "domains_name_idx" ON "domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");
