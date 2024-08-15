/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `portfolio_pages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portfolio_pages" DROP COLUMN "date_of_birth";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TEXT;
