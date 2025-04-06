// Lead types
export interface ScrapedData {
  description: string;
  services: string[];
  location: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  scrapedData: ScrapedData;
}

// Website template types
export interface WebsiteTemplate {
  id: string;
  name: string;
  description?: string;
  html: string;
  css?: string;
  thumbnail?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email template types
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  testStatus?: 'pending' | 'passed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: number;
  leadId: number;
  websiteTemplateId: number;
  emailTemplateId: number;
  status: string;
  purchaseDate: string;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  leadId: string;
  templateId: string;
  html: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  environment: 'development' | 'production';
  subdomain?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  lead?: Lead;
  template?: WebsiteTemplate;
} 