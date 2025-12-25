/*
  Warnings:

  - You are about to drop the column `option` on the `Quiz` table. All the data in the column will be lost.
  - Changed the type of `answer` on the `Quiz` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "option",
ADD COLUMN     "options" TEXT[],
DROP COLUMN "answer",
ADD COLUMN     "answer" INTEGER NOT NULL;
