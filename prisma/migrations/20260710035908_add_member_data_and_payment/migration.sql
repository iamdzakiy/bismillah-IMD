/*
  Warnings:

  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "googleSheetRow" INTEGER,
ADD COLUMN     "paymentProofUrl" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "memberData" JSONB;

-- DropTable
DROP TABLE "TeamMember";
