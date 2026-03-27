/*
  Warnings:

  - Added the required column `monthYear` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Made the column `originalAmount` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CustomerFlag" AS ENUM ('NONE', 'WARNING', 'CRITICAL', 'LEGAL_ACTION');

-- CreateEnum
CREATE TYPE "LegalActionType" AS ENUM ('WARNING_NOTICE', 'WATER_DISCONNECTION', 'LEGAL_FILING', 'FIELD_VISIT');

-- AlterEnum
ALTER TYPE "BillStatus" ADD VALUE 'ESCALATED';

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "monthYear" TEXT NOT NULL,
ADD COLUMN     "penaltyCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "originalAmount" SET NOT NULL;

-- AlterTable
ALTER TABLE "MeterReading" ALTER COLUMN "source" SET DEFAULT 'OCR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "flaggedAt" TIMESTAMP(3),
ADD COLUMN     "flaggedById" TEXT,
ADD COLUMN     "paymentFlag" "CustomerFlag" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "LegalAction" (
    "id" TEXT NOT NULL,
    "type" "LegalActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,

    CONSTRAINT "LegalAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LegalAction_customerId_idx" ON "LegalAction"("customerId");

-- CreateIndex
CREATE INDEX "LegalAction_officerId_idx" ON "LegalAction"("officerId");

-- CreateIndex
CREATE INDEX "Bill_monthYear_idx" ON "Bill"("monthYear");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_flaggedById_fkey" FOREIGN KEY ("flaggedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalAction" ADD CONSTRAINT "LegalAction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalAction" ADD CONSTRAINT "LegalAction_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
