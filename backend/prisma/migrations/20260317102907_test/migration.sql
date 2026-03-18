/*
  Warnings:

  - You are about to drop the column `homepageTemplateId` on the `website_templates` table. All the data in the column will be lost.
  - You are about to drop the `page_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_templateId_fkey";

-- DropForeignKey
ALTER TABLE "website_templates" DROP CONSTRAINT "website_templates_homepageTemplateId_fkey";

-- AlterTable
ALTER TABLE "website_templates" DROP COLUMN "homepageTemplateId",
ADD COLUMN     "homeLayout" JSONB;

-- DropTable
DROP TABLE "page_templates";
