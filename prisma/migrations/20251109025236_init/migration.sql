-- CreateTable
CREATE TABLE "Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "yearOrTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
