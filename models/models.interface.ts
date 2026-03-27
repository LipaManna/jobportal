export const org_types_array = ['development', 'business', 'design'] as const;
export type OrgType = typeof org_types_array[number];

export const team_size_array = ['2-10', '11-50', '51-100', '101-500', '501-1000', '1001+'] as const;
export type TeamSize = typeof team_size_array[number];

export interface IFormInput {
    username: string;
    email: string;
    companyname: string;
    companydescription: string;
    yearofestablishment: string;
    location: string;
    websiteurl: string;
    org_type: OrgType;
    team_size: TeamSize;
}
