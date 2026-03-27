"use server";

import { prisma } from "@/lib/prisma";
import { IFormInput } from "@/models/models.interface";
import { getCurrentUser } from "../auth/server/auth.queries";

export const updateEmployerSettings = async (
  data: IFormInput,
) => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  if (!currentUser) return null;
  try {
    const employer = await prisma.employer.update({
      where: {
        user_id: currentUser.id,
      },
      data: {
        company_name: data.companyname,
        company_description: data.companydescription,
        year_of_establishment: Number(data.yearofestablishment),
        company_location: data.location,
        company_website: data.websiteurl,
        org_type: data.org_type,
        employee_size: data.team_size,
      },
    });
    return employer;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update employer settings");
  }
};
