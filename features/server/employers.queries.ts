
import { getCurrentUser } from "../auth/server/auth.queries";
import { prisma } from "@/lib/prisma";


export const getCurrentEmployer = async () => {
    const currentUser = await getCurrentUser();
    
        if (!currentUser) {
            return null
        }
    
        if (currentUser?.role !== 'employer') {
            return null
        }
        const employer = await prisma.employer.findUnique({
            where: {
                user_id: currentUser.id
            }
        })
        
        const isProfileCompleted = 
        employer?.company_name &&
        employer?.company_logo_url &&
        employer?.company_description &&
        employer?.org_type &&
        employer?.company_location &&
        employer?.year_of_establishment &&
        employer?.employee_size;

        return {...currentUser, isProfileCompleted, employerDetails:employer};
}
