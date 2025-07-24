/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "isPaid",
DROP COLUMN "month",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "title" TEXT NOT NULL;
