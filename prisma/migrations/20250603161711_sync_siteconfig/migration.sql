/*
  Warnings:

  - You are about to drop the column `notice` on the `SiteConfig` table. All the data in the column will be lost.
  - Added the required column `email` to the `SiteConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `SiteConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `SiteConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteConfig" DROP COLUMN "notice",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL;
