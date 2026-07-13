/*
  Warnings:

  - You are about to alter the column `riskLevel` on the `ClinicalRecord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "ClinicalRecord" ALTER COLUMN "riskLevel" SET DATA TYPE VARCHAR(100);
