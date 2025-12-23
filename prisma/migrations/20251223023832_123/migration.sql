/*
  Warnings:

  - You are about to drop the column `quetion` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `question` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "quetion",
ADD COLUMN     "question" TEXT NOT NULL;
