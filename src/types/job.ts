export interface JobPosting {
    id: string;
    role: string;
    company: string;
    companyLogo: string;
    postedDate: string;
    daysAgo: number;
    stipend?: string;
    location: string;
    officeCoords: [number, number];
    postUrl: string;
    email?: string;
    phone?: string;
    posterName: string;
    posterTitle: string;
    posterAvatar: string;
    tags: string[];
    distance?: number;
}
