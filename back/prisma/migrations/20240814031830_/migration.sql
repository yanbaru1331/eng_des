-- AlterTable
ALTER TABLE "portfolio_pages" ADD COLUMN     "max_depth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "max_score" INTEGER NOT NULL DEFAULT 1;
