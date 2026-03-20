/*
  Warnings:

  - You are about to drop the column `templateId` on the `pages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "websites" DROP CONSTRAINT "websites_settings_id_fkey";

-- AlterTable
ALTER TABLE "pages" DROP COLUMN "templateId";

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
