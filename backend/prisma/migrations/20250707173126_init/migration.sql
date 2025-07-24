/*
  Warnings:

  - You are about to drop the column `message` on the `Complaint` table. All the data in the column will be lost.
  - Added the required column `description` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "message",
ADD COLUMN     "description" TEXT NOT NULL;
