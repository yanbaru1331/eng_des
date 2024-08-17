-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL,
    "date_of_birth" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_pages" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "contact_address" TEXT NOT NULL DEFAULT 'Not set',
    "max_item" INTEGER NOT NULL DEFAULT 3,
    "max_depth" INTEGER NOT NULL DEFAULT 1,
    "max_score" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "portfolio_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_rader_chart_leaves" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "chart_id" INTEGER NOT NULL,
    "page_id" INTEGER NOT NULL,

    CONSTRAINT "portfolio_rader_chart_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_rader_chart" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "page_id" INTEGER NOT NULL,

    CONSTRAINT "portfolio_rader_chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_radar_chart_relation" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,

    CONSTRAINT "portfolio_radar_chart_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_pages_user_id_key" ON "portfolio_pages"("user_id");

-- AddForeignKey
ALTER TABLE "portfolio_pages" ADD CONSTRAINT "portfolio_pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart_leaves" ADD CONSTRAINT "portfolio_rader_chart_leaves_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "portfolio_rader_chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart_leaves" ADD CONSTRAINT "portfolio_rader_chart_leaves_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rader_chart" ADD CONSTRAINT "portfolio_rader_chart_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_radar_chart_relation" ADD CONSTRAINT "portfolio_radar_chart_relation_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "portfolio_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_radar_chart_relation" ADD CONSTRAINT "portfolio_radar_chart_relation_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "portfolio_rader_chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_radar_chart_relation" ADD CONSTRAINT "portfolio_radar_chart_relation_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "portfolio_rader_chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
