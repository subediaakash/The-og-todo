/*
  Warnings:

  - You are about to drop the `UserCommitments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCommitments" DROP CONSTRAINT "UserCommitments_userId_fkey";

-- DropTable
DROP TABLE "UserCommitments";
