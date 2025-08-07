-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "aboutMe" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "birthdate" DATETIME,
    "progress" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "OnboardingConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "component" TEXT NOT NULL,
    "page" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
