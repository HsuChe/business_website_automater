import React, { createContext, useContext, ReactNode } from 'react';
import { mockApi } from './mock-api';
import { 
  Lead, 
  WebsiteTemplate, 
  EmailTemplate, 
  Order,
  Deployment
} from './types';

// Define the API interface
export interface Api {
  // Leads
  getLeads: () => Promise<Lead[]>;
  getLeadById: (id: number) => Promise<Lead | null>;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead>;
  updateLead: (id: number, updates: Partial<Lead>) => Promise<Lead | null>;
  deleteLead: (id: number) => Promise<boolean>;
  
  // Website Templates
  getWebsiteTemplates: () => Promise<WebsiteTemplate[]>;
  getWebsiteTemplateById: (id: number) => Promise<WebsiteTemplate | null>;
  getPassedWebsiteTemplates: () => Promise<WebsiteTemplate[]>;
  createWebsiteTemplate: (template: Omit<WebsiteTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WebsiteTemplate>;
  updateWebsiteTemplate: (id: number, updates: Partial<WebsiteTemplate>) => Promise<WebsiteTemplate | null>;
  deleteWebsiteTemplate: (id: number) => Promise<boolean>;
  
  // Email Templates
  getEmailTemplates: () => Promise<EmailTemplate[]>;
  getEmailTemplateById: (id: number) => Promise<EmailTemplate | null>;
  getPassedEmailTemplates: () => Promise<EmailTemplate[]>;
  createEmailTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<EmailTemplate>;
  updateEmailTemplate: (id: number, updates: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
  deleteEmailTemplate: (id: number) => Promise<boolean>;
  
  // Orders
  getOrders: () => Promise<Order[]>;
  getOrderById: (id: number) => Promise<Order | null>;
  getOrdersByLeadId: (leadId: number) => Promise<Order[]>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrder: (id: number, updates: Partial<Order>) => Promise<Order | null>;
  deleteOrder: (id: number) => Promise<boolean>;

  // Deployment methods
  getDeployments: () => Promise<Deployment[]>;
  getDeployment: (id: string) => Promise<Deployment>;
  updateDeployment: (id: string, data: Partial<Deployment>) => Promise<Deployment>;
  deleteDeployment: (id: string) => Promise<void>;
}

// Create the context
const ApiContext = createContext<Api | null>(null);

// Create a provider component
interface ApiProviderProps {
  children: ReactNode;
  api?: Api;
}

export function ApiProvider({ children, api = mockApi }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

// Create a hook to use the API
export function useApi(): Api {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return api;
} 