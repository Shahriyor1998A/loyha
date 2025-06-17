/*
  Warnings:

  - You are about to drop the column `image` on the `House` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "House" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
