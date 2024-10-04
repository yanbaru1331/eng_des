/*
  Warnings:

  - You are about to drop the column `createdAt` on the `portfolio_pages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `portfolio_pages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `portfolio_radar_chart_relation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `portfolio_radar_chart_relation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `portfolio_rader_chart` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `portfolio_rader_chart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `portfolio_rader_chart_leaves` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `portfolio_rader_chart_leaves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portfolio_pages" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "portfolio_radar_chart_relation" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "portfolio_rader_chart" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "portfolio_rader_chart_leaves" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
