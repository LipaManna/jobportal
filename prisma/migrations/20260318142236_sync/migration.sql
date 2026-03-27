-- CreateEnum
CREATE TYPE "Marital_Status" AS ENUM ('single', 'married', 'divorced', 'widowed');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('high_school', 'diploma', 'bachelor', 'master', 'phd');

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- CreateTable
CREATE TABLE "Employer" (
    "user_id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_logo_url" TEXT,
    "company_description" TEXT,
    "company_banner_image_url" TEXT,
    "org_type" TEXT,
    "company_website" TEXT,
    "company_phone" TEXT,
    "company_email" TEXT,
    "company_location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "year_of_establishment" INTEGER,
    "employee_size" TEXT,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "user_id" INTEGER NOT NULL,
    "biography" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT,
    "marital_status" "Marital_Status" NOT NULL,
    "gender" "Gender" NOT NULL,
    "experience" TEXT NOT NULL,
    "education" "Education" NOT NULL,
    "website_url" TEXT,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
