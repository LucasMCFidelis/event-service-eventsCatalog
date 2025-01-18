/*
  Warnings:

  - A unique constraint covering the columns `[organizerCnpj]` on the table `event_organizers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "event_organizers_organizerCnpj_key" ON "event_organizers"("organizerCnpj");
