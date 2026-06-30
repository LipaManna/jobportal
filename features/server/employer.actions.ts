"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../auth/server/auth.queries";
import { EmployerProfileData } from "../employers/employers.schema";

import { revalidatePath } from "next/cache";

export const updateEmployerSettings = async (
  data: EmployerProfileData,
) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  try {
    const employer = await prisma.employer.upsert({
      where: {
        user_id: currentUser.id,
      },
      update: {
        company_name: data.name,
        company_description: data.description,
        company_logo_url: typeof data.image === "string" ? data.image : undefined,
        year_of_establishment: data.yearOfEstablishment ? Number(data.yearOfEstablishment) : null,
        company_location: data.location,
        company_website: data.websiteUrl,
        org_type: data.orgType,
        employee_size: data.teamSize,
      },
      create: {
        user_id: currentUser.id,
        company_name: data.name,
        company_description: data.description,
        company_logo_url: typeof data.image === "string" ? data.image : undefined,
        year_of_establishment: data.yearOfEstablishment ? Number(data.yearOfEstablishment) : null,
        company_location: data.location,
        company_website: data.websiteUrl,
        org_type: data.orgType,
        employee_size: data.teamSize,
      },
    });

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        username: data.username,
        email: data.email,
      }
    });
    revalidatePath("/employer-dashboard", "layout");
    return employer;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update employer settings";
    console.error("Action error:", error);
    return { error: message };
  }
};
