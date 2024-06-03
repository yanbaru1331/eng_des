-- DropForeignKey
ALTER TABLE "content_tag" DROP CONSTRAINT "content_tag_content_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_contents" DROP CONSTRAINT "portfolio_contents_tab_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_pages" DROP CONSTRAINT "portfolio_pages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_tabs" DROP CONSTRAINT "portfolio_tabs_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_login" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "portfolio_pages" ADD CONSTRAINT "portfolio_pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_tabs" ADD CONSTRAINT "portfolio_tabs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_contents" ADD CONSTRAINT "portfolio_contents_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "portfolio_tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tag" ADD CONSTRAINT "content_tag_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "portfolio_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
