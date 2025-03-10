/*
  Warnings:

  - You are about to drop the column `motorcycle_model_year_color_id` on the `user_motorcycles` table. All the data in the column will be lost.
  - Added the required column `motorcycle_model_year_id` to the `user_motorcycles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_motorcycles" DROP CONSTRAINT "user_motorcycles_motorcycle_model_year_color_id_fkey";

-- AlterTable
ALTER TABLE "user_motorcycles" DROP COLUMN "motorcycle_model_year_color_id",
ADD COLUMN     "motorcycle_model_year_id" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "fcm_token" TEXT;

-- AddForeignKey
ALTER TABLE "user_motorcycles" ADD CONSTRAINT "user_motorcycles_motorcycle_model_year_id_fkey" FOREIGN KEY ("motorcycle_model_year_id") REFERENCES "motorcycle_model_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
