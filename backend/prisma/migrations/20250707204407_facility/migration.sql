/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facilityId,date,slot,userId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotTime" AS ENUM ('S_09_10', 'S_10_11', 'S_11_12', 'S_14_15', 'S_15_16');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "timeSlot",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slot" "SlotTime" NOT NULL;

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "Booking_facilityId_idx" ON "Booking"("facilityId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_facilityId_date_slot_userId_key" ON "Booking"("facilityId", "date", "slot", "userId");
