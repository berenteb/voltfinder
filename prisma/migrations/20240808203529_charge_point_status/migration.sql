-- CreateEnum
CREATE TYPE "ChargePointStatusEnum" AS ENUM ('Available', 'Charging', 'Offline', 'Unknown');

-- CreateTable
CREATE TABLE "ChargePointStatus" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "status" "ChargePointStatusEnum" NOT NULL,

    CONSTRAINT "ChargePointStatus_pkey" PRIMARY KEY ("id")
);
