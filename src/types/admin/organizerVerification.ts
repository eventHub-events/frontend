export interface SelectedOrganizerDetail {
  organizerId: {
    _id: string;
    name: string;
    email: string;
    phone: number;
  };
  organization: string;
  bio: string;
  location: string;
  website: string;
  trustScore: number;
  totalEarnings: number | null;
  profilePicture: string;
  kycVerified: boolean;
  documents: OrganizerDocument[];
}

export interface OrganizerDocument {
  _id: string;
  type: string;
  url: string;
  status: "Pending" | "Approved" | "Rejected";
  uploadedAt: string;
  updatedAt: string;
  createdAt: string;
  organizerId: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reason: string;
  verified: boolean;
}

export interface OrganizerDetail {

    id: string;
    name: string;
    email: string;
      kycStatus: "Pending" | "Verified" | "Rejected";
      role:string;
      createdAt:Date;
      organizerProfile:{
          location: string;
  organization: string;
  bio: string;
  website: string;
  trustScore: number;
  totalEarnings: number;
  kycVerified: boolean;
  profilePicture: string;
  
      }
  
  
}