-- CreateEnum
CREATE TYPE "AccessibilityLevel" AS ENUM ('Sem Acessibilidade', 'Acessibilidade Básica', 'Acessibilidade Auditiva', 'Acessibilidade Visual', 'Acessibilidade Completa', 'Acessibilidade não informada');

-- CreateTable
CREATE TABLE "events" (
    "eventId" TEXT NOT NULL,
    "eventTitle" VARCHAR(120) NOT NULL,
    "eventDescription" VARCHAR(600),
    "eventLink" VARCHAR(255),
    "eventPrice" DECIMAL(8,2) NOT NULL,
    "eventAddressStreet" VARCHAR(120) NOT NULL,
    "eventAddressNumber" VARCHAR(8) NOT NULL,
    "eventAddressNeighborhood" VARCHAR(20) NOT NULL,
    "eventAddressComplement" VARCHAR(30),
    "eventAccessibilityLevel" "AccessibilityLevel" NOT NULL DEFAULT 'Acessibilidade não informada',
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventOrganizerId" TEXT NOT NULL,
    "eventCategoryId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "event_organizers" (
    "organizerId" TEXT NOT NULL,
    "organizerName" VARCHAR(100) NOT NULL,
    "organizerCnpj" VARCHAR(18) NOT NULL,
    "organizerEmail" VARCHAR(100) NOT NULL,
    "organizerPhoneNumber" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_organizers_pkey" PRIMARY KEY ("organizerId")
);

-- CreateTable
CREATE TABLE "event_categories" (
    "categoryId" TEXT NOT NULL,
    "categoryName" VARCHAR(30) NOT NULL,
    "categoryDescription" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_organizers_organizerEmail_key" ON "event_organizers"("organizerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_categoryName_key" ON "event_categories"("categoryName");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventOrganizerId_fkey" FOREIGN KEY ("eventOrganizerId") REFERENCES "event_organizers"("organizerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventCategoryId_fkey" FOREIGN KEY ("eventCategoryId") REFERENCES "event_categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
