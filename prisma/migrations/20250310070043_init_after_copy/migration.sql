/*
  Warnings:

  - The values [PUTTY,SURFACER,APPLICATION_COLOR_BASE,APPLICATION_CLEAR_COAT,POLISHING,FINAL_QC,COMPLETED] on the enum `WorkStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_car_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `_CarServiceToOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_model_year_colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_model_years` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `car_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_cars` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_motorcycle_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkStatus_new" AS ENUM ('QUEUED', 'INSPECTION', 'IN_PROGRESS', 'CANCELLED');
ALTER TABLE "orders" ALTER COLUMN "work_status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "work_status" TYPE "WorkStatus_new" USING ("work_status"::text::"WorkStatus_new");
ALTER TYPE "WorkStatus" RENAME TO "WorkStatus_old";
ALTER TYPE "WorkStatus_new" RENAME TO "WorkStatus";
DROP TYPE "WorkStatus_old";
ALTER TABLE "orders" ALTER COLUMN "work_status" SET DEFAULT 'QUEUED';
COMMIT;

-- DropForeignKey
ALTER TABLE "_CarServiceToOrder" DROP CONSTRAINT "_CarServiceToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarServiceToOrder" DROP CONSTRAINT "_CarServiceToOrder_B_fkey";

-- DropForeignKey
ALTER TABLE "car_model_year_colors" DROP CONSTRAINT "car_model_year_colors_car_model_year_id_fkey";

-- DropForeignKey
ALTER TABLE "car_model_year_colors" DROP CONSTRAINT "car_model_year_colors_color_id_fkey";

-- DropForeignKey
ALTER TABLE "car_model_years" DROP CONSTRAINT "car_model_years_car_model_id_fkey";

-- DropForeignKey
ALTER TABLE "car_models" DROP CONSTRAINT "car_models_car_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_car_id_fkey";

-- DropForeignKey
ALTER TABLE "user_cars" DROP CONSTRAINT "user_cars_car_model_year_color_id_fkey";

-- DropForeignKey
ALTER TABLE "user_cars" DROP CONSTRAINT "user_cars_user_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_car_id",
ADD COLUMN     "user_motorcycle_id" VARCHAR(30) NOT NULL;

-- DropTable
DROP TABLE "_CarServiceToOrder";

-- DropTable
DROP TABLE "car_brands";

-- DropTable
DROP TABLE "car_model_year_colors";

-- DropTable
DROP TABLE "car_model_years";

-- DropTable
DROP TABLE "car_models";

-- DropTable
DROP TABLE "car_services";

-- DropTable
DROP TABLE "colors";

-- DropTable
DROP TABLE "user_cars";

-- CreateTable
CREATE TABLE "motorcycle_brands" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "logo" TEXT NOT NULL,
    "country" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_models" (
    "id" VARCHAR(30) NOT NULL,
    "motorcycle_brand_id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_model_years" (
    "id" VARCHAR(30) NOT NULL,
    "motorcycle_model_id" VARCHAR(30) NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_model_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_motorcycles" (
    "id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "motorcycle_model_year_color_id" VARCHAR(30) NOT NULL,
    "license_plate" VARCHAR(50) NOT NULL,
    "motorcycle_images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_motorcycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_services" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MotorcycleServiceToOrder" (
    "A" VARCHAR(30) NOT NULL,
    "B" VARCHAR(30) NOT NULL,

    CONSTRAINT "_MotorcycleServiceToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "motorcycle_brands_name_key" ON "motorcycle_brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycle_models_name_motorcycle_brand_id_key" ON "motorcycle_models"("name", "motorcycle_brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycle_model_years_year_motorcycle_model_id_key" ON "motorcycle_model_years"("year", "motorcycle_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycle_services_name_key" ON "motorcycle_services"("name");

-- CreateIndex
CREATE INDEX "_MotorcycleServiceToOrder_B_index" ON "_MotorcycleServiceToOrder"("B");

-- AddForeignKey
ALTER TABLE "motorcycle_models" ADD CONSTRAINT "motorcycle_models_motorcycle_brand_id_fkey" FOREIGN KEY ("motorcycle_brand_id") REFERENCES "motorcycle_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycle_model_years" ADD CONSTRAINT "motorcycle_model_years_motorcycle_model_id_fkey" FOREIGN KEY ("motorcycle_model_id") REFERENCES "motorcycle_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_motorcycles" ADD CONSTRAINT "user_motorcycles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_motorcycles" ADD CONSTRAINT "user_motorcycles_motorcycle_model_year_color_id_fkey" FOREIGN KEY ("motorcycle_model_year_color_id") REFERENCES "motorcycle_model_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_motorcycle_id_fkey" FOREIGN KEY ("user_motorcycle_id") REFERENCES "user_motorcycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotorcycleServiceToOrder" ADD CONSTRAINT "_MotorcycleServiceToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "motorcycle_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotorcycleServiceToOrder" ADD CONSTRAINT "_MotorcycleServiceToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
