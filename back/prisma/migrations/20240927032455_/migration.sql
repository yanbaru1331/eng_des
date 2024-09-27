/*
  Warnings:

  - You are about to drop the column `scoreNum` on the `portfolio_score_standards` table. All the data in the column will be lost.
  - Added the required column `score_um` to the `portfolio_score_standards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolio_score_standards" DROP COLUMN "scoreNum",
ADD COLUMN     "score_um" INTEGER NOT NULL;
