/*
  Warnings:

  - You are about to drop the column `website_id` on the `global_design` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[globalDesignId]` on the table `websites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `globalDesignId` to the `websites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "global_design" DROP CONSTRAINT "global_design_website_id_fkey";

-- DropIndex
DROP INDEX "global_design_website_id_idx";

-- DropIndex
DROP INDEX "global_design_website_id_key";

-- AlterTable
ALTER TABLE "global_design" DROP COLUMN "website_id";

-- AlterTable
ALTER TABLE "websites" ADD COLUMN     "globalDesignId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "websites_globalDesignId_key" ON "websites"("globalDesignId");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_globalDesignId_fkey" FOREIGN KEY ("globalDesignId") REFERENCES "global_design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
