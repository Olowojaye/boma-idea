-- CreateEnum
CREATE TYPE "State" AS ENUM ('Propose', 'Open', 'Closed');

-- CreateEnum
CREATE TYPE "Permit" AS ENUM ('Read', 'Create', 'Update', 'Delete');

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permit" "Permit" NOT NULL,

    CONSTRAINT "access_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access" ADD CONSTRAINT "access_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
