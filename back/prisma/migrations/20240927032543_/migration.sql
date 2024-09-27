/*
  Warnings:

  - You are about to drop the column `score_um` on the `portfolio_score_standards` table. All the data in the column will be lost.
  - Added the required column `score_num` to the `portfolio_score_standards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolio_score_standards" DROP COLUMN "score_um",
ADD COLUMN     "score_num" INTEGER NOT NULL;
