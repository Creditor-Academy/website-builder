/*
  Warnings:

  - You are about to drop the column `currentDraftVersionId` on the `websites` table. All the data in the column will be lost.
  - You are about to drop the column `currentPublishedVersionId` on the `websites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[homepageId]` on the table `websites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "GlobalSlotType" AS ENUM ('NAVBAR', 'FOOTER');

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "websites" DROP COLUMN "currentDraftVersionId",
DROP COLUMN "currentPublishedVersionId",
ADD COLUMN     "homepageId" TEXT;

-- CreateTable
CREATE TABLE "global_design" (
    "id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "websiteTemplateId" TEXT,
    "global_styles" JSONB NOT NULL,

    CONSTRAINT "global_design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_slots" (
    "id" TEXT NOT NULL,
    "global_design_id" TEXT NOT NULL,
    "type" "GlobalSlotType" NOT NULL,
    "section_template_id" TEXT,
    "props" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "global_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "page_styles" JSONB,
    "templateId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sectionTemplateId" TEXT,
    "order" INTEGER NOT NULL,
    "props" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "global_style" JSONB,
    "navbar" JSONB,
    "footer" JSONB,
    "homepageTemplateId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "sections" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "page_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "email" TEXT,
    "props" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "section_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_design_website_id_key" ON "global_design"("website_id");

-- CreateIndex
CREATE INDEX "global_design_website_id_idx" ON "global_design"("website_id");

-- CreateIndex
CREATE UNIQUE INDEX "global_slots_global_design_id_type_key" ON "global_slots"("global_design_id", "type");

-- CreateIndex
CREATE INDEX "pages_slug_website_id_idx" ON "pages"("slug", "website_id");

-- CreateIndex
CREATE INDEX "pages_deleted_at_idx" ON "pages"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_website_id_key" ON "pages"("slug", "website_id");

-- CreateIndex
CREATE INDEX "sections_page_id_order_idx" ON "sections"("page_id", "order");

-- CreateIndex
CREATE INDEX "sections_deleted_at_idx" ON "sections"("deleted_at");

-- CreateIndex
CREATE INDEX "website_templates_name_idx" ON "website_templates"("name");

-- CreateIndex
CREATE INDEX "website_templates_category_idx" ON "website_templates"("category");

-- CreateIndex
CREATE INDEX "website_templates_deleted_at_idx" ON "website_templates"("deleted_at");

-- CreateIndex
CREATE INDEX "page_templates_name_idx" ON "page_templates"("name");

-- CreateIndex
CREATE INDEX "page_templates_category_idx" ON "page_templates"("category");

-- CreateIndex
CREATE INDEX "page_templates_deleted_at_idx" ON "page_templates"("deleted_at");

-- CreateIndex
CREATE INDEX "section_templates_name_idx" ON "section_templates"("name");

-- CreateIndex
CREATE INDEX "section_templates_category_idx" ON "section_templates"("category");

-- CreateIndex
CREATE INDEX "section_templates_deleted_at_idx" ON "section_templates"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "websites_homepageId_key" ON "websites"("homepageId");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_homepageId_fkey" FOREIGN KEY ("homepageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_design" ADD CONSTRAINT "global_design_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_design" ADD CONSTRAINT "global_design_websiteTemplateId_fkey" FOREIGN KEY ("websiteTemplateId") REFERENCES "website_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_slots" ADD CONSTRAINT "global_slots_global_design_id_fkey" FOREIGN KEY ("global_design_id") REFERENCES "global_design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_slots" ADD CONSTRAINT "global_slots_section_template_id_fkey" FOREIGN KEY ("section_template_id") REFERENCES "section_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "page_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_sectionTemplateId_fkey" FOREIGN KEY ("sectionTemplateId") REFERENCES "section_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_templates" ADD CONSTRAINT "website_templates_homepageTemplateId_fkey" FOREIGN KEY ("homepageTemplateId") REFERENCES "page_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
