/*
  Warnings:

  - The primary key for the `portfolio_pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id]` on the table `portfolio_pages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "portfolio_pages" DROP CONSTRAINT "portfolio_pages_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "portfolio_pages_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_pages_user_id_key" ON "portfolio_pages"("user_id");
