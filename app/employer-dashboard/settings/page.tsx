import EmployerSettingsForm from "@/features/employers/components/EmployerSettingsForm";
import { getCurrentEmployer } from "@/features/server/employers.queries";

const EmployerSettings = async () => {
  const currentEmployer = await getCurrentEmployer();
  return (
    <div>
      <EmployerSettingsForm
        initialData={{
          username: currentEmployer?.username || "",
          email: currentEmployer?.email || "",
          image: currentEmployer?.employerDetails?.company_logo_url || "",
          name: currentEmployer?.employerDetails?.company_name || "",
          description: currentEmployer?.employerDetails?.company_description || "",
          yearOfEstablishment: currentEmployer?.employerDetails?.year_of_establishment?.toString(),
          teamSize: (currentEmployer?.employerDetails?.employee_size as any) || undefined,
          orgType: (currentEmployer?.employerDetails?.org_type as any) || undefined,
          websiteUrl: currentEmployer?.employerDetails?.company_website || "",
          location: currentEmployer?.employerDetails?.company_location || "",
        }}
      />
    </div>
  );
};

export default EmployerSettings;
