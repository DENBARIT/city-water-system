-- CreateEnum
CREATE TYPE "ReadingSource" AS ENUM ('MANUAL', 'OCR');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "originalAmount" DOUBLE PRECISION,
ADD COLUMN     "penaltyAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "penaltyApplied" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MeterReading" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "source" "ReadingSource" NOT NULL DEFAULT 'MANUAL';

-- CreateTable
CREATE TABLE "SubmissionWindow" (
    "id" TEXT NOT NULL,
    "startDay" INTEGER NOT NULL,
    "endDay" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "SubmissionWindow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmissionWindow" ADD CONSTRAINT "SubmissionWindow_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
