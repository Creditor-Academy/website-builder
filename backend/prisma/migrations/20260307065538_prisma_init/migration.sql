/*
  Warnings:

  - Made the column `settings_id` on table `websites` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "websites" ALTER COLUMN "settings_id" SET NOT NULL;
