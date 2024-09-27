-- CreateTable
CREATE TABLE "portfolio_score_standards" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "scoreNum" INTEGER NOT NULL,
    "standard" TEXT NOT NULL,

    CONSTRAINT "portfolio_score_standards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portfolio_score_standards" ADD CONSTRAINT "portfolio_score_standards_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
