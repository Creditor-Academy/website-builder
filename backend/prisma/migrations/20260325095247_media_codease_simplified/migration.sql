/*
  Warnings:

  - You are about to drop the column `thumbnail_url` on the `section_templates` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `website_templates` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `websites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "section_templates" DROP COLUMN "thumbnail_url";

-- AlterTable
ALTER TABLE "website_templates" DROP COLUMN "thumbnail_url";

-- AlterTable
ALTER TABLE "websites" DROP COLUMN "thumbnail_url";
