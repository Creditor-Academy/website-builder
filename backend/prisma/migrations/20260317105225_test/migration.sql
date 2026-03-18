/*
  Warnings:

  - You are about to drop the column `global_style` on the `website_templates` table. All the data in the column will be lost.
  - You are about to drop the column `homeLayout` on the `website_templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "website_templates" DROP COLUMN "global_style",
DROP COLUMN "homeLayout",
ADD COLUMN     "global_styles" JSONB,
ADD COLUMN     "home_layout" JSONB;
