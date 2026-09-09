-- CreateEnum
CREATE TYPE "SemifinalRegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SemifinalRegistration" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" "SemifinalRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "paymentProofUrl" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "adminNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemifinalRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SemifinalRegistration_teamId_key" ON "SemifinalRegistration"("teamId");

-- CreateIndex
CREATE INDEX "SemifinalRegistration_status_idx" ON "SemifinalRegistration"("status");

-- AddForeignKey
ALTER TABLE "SemifinalRegistration" ADD CONSTRAINT "SemifinalRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;