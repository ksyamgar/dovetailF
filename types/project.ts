export type ProjectCategory = 
  | 'Conservation'
  | 'Residential'
  | 'Interiors'
  | 'Planning'
  | 'Hospitality'
  | 'Public';

export interface Project {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: ProjectCategory;
  color: string;
  year: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lng: number;
  alt: string;
  siteArea?: string;
  structure?: string;
  lead: string;
  description: string;
  heroImage: string;
  images: string[];
  model3dUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoType?: 'mp4' | 'youtube' | 'vimeo';
  externalLink?: { label: string; url: string };
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
}

export interface InquirySubmission {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  serviceType?: string;
  message: string;
  status?: 'unread' | 'read' | 'archived';
  isImportant?: boolean;
  createdAt?: string;
}

export interface SiteSettings {
  practiceName: string;
  tagline: string;
  leadStatement: string;
  primaryEmail: string;
  primaryPhone: string;
  mainStudioAddress: string;
  coordinates: {
    lat: number;
    lng: number;
    alt: string;
  };
}
