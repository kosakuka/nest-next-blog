/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "login_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_login_id_key" ON "users"("login_id");
