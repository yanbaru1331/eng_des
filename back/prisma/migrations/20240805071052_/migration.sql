/*
  Warnings:

  - You are about to drop the column `user_id` on the `portfolio_pages` table. All the data in the column will be lost.
  - You are about to drop the `content_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `portfolio_contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `portfolio_tabs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `portfolio_pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `portfolio_pages` table without a default value. This is not possible if the table is not empty.
  - Made the column `contact_address` on table `portfolio_pages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "content_tag" DROP CONSTRAINT "content_tag_content_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_contents" DROP CONSTRAINT "portfolio_contents_tab_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_pages" DROP CONSTRAINT "portfolio_pages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_tabs" DROP CONSTRAINT "portfolio_tabs_user_id_fkey";

-- DropIndex
DROP INDEX "portfolio_pages_user_id_key";

-- AlterTable
ALTER TABLE "portfolio_pages" DROP COLUMN "user_id",
ADD COLUMN     "max_item" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "contact_address" SET NOT NULL,
ALTER COLUMN "contact_address" SET DEFAULT 'Not set',
ALTER COLUMN "published" SET DEFAULT false;

-- DropTable
DROP TABLE "content_tag";

-- DropTable
DROP TABLE "portfolio_contents";

-- DropTable
DROP TABLE "portfolio_tabs";

-- DropEnum
DROP TYPE "contenttype";

-- CreateTable
CREATE TABLE "portfolio_rader_chart_leaf" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "raderId" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "portfolio_rader_chart_leaf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_rader_chart" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "portfolio_rader_chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_radar_chart_relation" (
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,

    CONSTRAINT "portfolio_radar_chart_relation_pkey" PRIMARY KEY ("parentId","childId")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_pages_userId_key" ON "portfolio_pages"("userId");

-- AddForeignKey
ALTER TABLE "portfolio_pages" ADD CONSTRAINT "portfolio_pages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart_leaf" ADD CONSTRAINT "portfolio_rader_chart_leaf_raderId_fkey" FOREIGN KEY ("raderId") REFERENCES "portfolio_rader_chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart_leaf" ADD CONSTRAINT "portfolio_rader_chart_leaf_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart" ADD CONSTRAINT "portfolio_rader_chart_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_radar_chart_relation" ADD CONSTRAINT "portfolio_radar_chart_relation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "portfolio_rader_chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_radar_chart_relation" ADD CONSTRAINT "portfolio_radar_chart_relation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "portfolio_rader_chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
