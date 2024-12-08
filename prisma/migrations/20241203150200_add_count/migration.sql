/*
  Warnings:

  - Added the required column `count` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "count" INTEGER NOT NULL;
