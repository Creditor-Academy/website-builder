-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'INSTITUTION_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "institution_id" TEXT;

-- AlterTable
ALTER TABLE "websites" ADD COLUMN     "content" JSONB,
ADD COLUMN     "institution_id" TEXT,
ALTER COLUMN "settings_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institutions_email_key" ON "institutions"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
