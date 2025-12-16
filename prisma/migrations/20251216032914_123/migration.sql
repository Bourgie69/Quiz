/*
  Warnings:

  - You are about to drop the column `userId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserScores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_articleId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserScores" DROP CONSTRAINT "UserScores_quizId_fkey";

-- DropForeignKey
ALTER TABLE "UserScores" DROP CONSTRAINT "UserScores_userId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "userId";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "QuizAttempt";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserScores";
