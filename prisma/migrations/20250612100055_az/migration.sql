/*
  Warnings:

  - You are about to drop the column `images` on the `House` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "House" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;
