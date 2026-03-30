-- CreateTable
CREATE TABLE "page_snapshots" (
    "id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_snapshots_page_id_key" ON "page_snapshots"("page_id");

-- CreateIndex
CREATE INDEX "page_snapshots_website_id_idx" ON "page_snapshots"("website_id");

-- CreateIndex
CREATE INDEX "page_snapshots_website_id_slug_idx" ON "page_snapshots"("website_id", "slug");

-- CreateIndex
CREATE INDEX "page_snapshots_page_id_idx" ON "page_snapshots"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_snapshots_website_id_slug_key" ON "page_snapshots"("website_id", "slug");

-- AddForeignKey
ALTER TABLE "page_snapshots" ADD CONSTRAINT "page_snapshots_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_snapshots" ADD CONSTRAINT "page_snapshots_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
