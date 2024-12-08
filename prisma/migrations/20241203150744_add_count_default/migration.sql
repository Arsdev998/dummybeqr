/*
  Warnings:

  - Added the required column `countLimit` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "countLimit" INTEGER NOT NULL,
ALTER COLUMN "count" SET DEFAULT 0;
