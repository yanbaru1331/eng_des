-- CreateEnum
CREATE TYPE "contenttype" AS ENUM ('TEXT', 'PICTURE', 'LIST');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_pages" (
    "user_id" INTEGER NOT NULL,
    "contact_address" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL,

    CONSTRAINT "portfolio_pages_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "portfolio_tabs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tab_name" TEXT NOT NULL,
    "tab_type" "contenttype" NOT NULL,

    CONSTRAINT "portfolio_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_contents" (
    "tab_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "image" TEXT,

    CONSTRAINT "portfolio_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tag" (
    "content_id" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "content_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "portfolio_pages" ADD CONSTRAINT "portfolio_pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_tabs" ADD CONSTRAINT "portfolio_tabs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_contents" ADD CONSTRAINT "portfolio_contents_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "portfolio_tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tag" ADD CONSTRAINT "content_tag_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "portfolio_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
