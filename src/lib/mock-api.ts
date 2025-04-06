import { 
  Lead, 
  WebsiteTemplate, 
  EmailTemplate, 
  Order 
} from './types';
import { 
  DEMO_DATA, 
  getLeads, 
  getWebsiteTemplates, 
  getEmailTemplates, 
  getOrders,
  getLeadById,
  getWebsiteTemplateById,
  getEmailTemplateById,
  getOrderById,
  getOrdersByLeadId,
  getPassedWebsiteTemplates,
  getPassedEmailTemplates
} from './demo-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApi = {
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    await delay(500); // Simulate network delay
    return getLeads();
  },
  
  getLeadById: async (id: number): Promise<Lead | null> => {
    await delay(300);
    const lead = getLeadById(id);
    return lead || null;
  },
  
  createLead: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    await delay(700);
    const newLead: Lead = {
      ...lead,
      id: Math.max(...DEMO_DATA.leads.map(l => l.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.leads.push(newLead);
    return newLead;
  },
  
  updateLead: async (id: number, updates: Partial<Lead>): Promise<Lead | null> => {
    await delay(600);
    const index = DEMO_DATA.leads.findIndex(lead => lead.id === id);
    if (index === -1) return null;
    
    const updatedLead = {
      ...DEMO_DATA.leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.leads[index] = updatedLead;
    return updatedLead;
  },
  
  deleteLead: async (id: number): Promise<boolean> => {
    await delay(500);
    const index = DEMO_DATA.leads.findIndex(lead => lead.id === id);
    if (index === -1) return false;
    
    DEMO_DATA.leads.splice(index, 1);
    return true;
  },
  
  // Website Templates
  getWebsiteTemplates: async (): Promise<WebsiteTemplate[]> => {
    await delay(500);
    return getWebsiteTemplates();
  },
  
  getWebsiteTemplateById: async (id: number): Promise<WebsiteTemplate | null> => {
    await delay(300);
    const template = getWebsiteTemplateById(id);
    return template || null;
  },
  
  getPassedWebsiteTemplates: async (): Promise<WebsiteTemplate[]> => {
    await delay(400);
    return getPassedWebsiteTemplates();
  },
  
  createWebsiteTemplate: async (template: Omit<WebsiteTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebsiteTemplate> => {
    await delay(700);
    const newTemplate: WebsiteTemplate = {
      ...template,
      id: Math.max(...DEMO_DATA.websiteTemplates.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.websiteTemplates.push(newTemplate);
    return newTemplate;
  },
  
  updateWebsiteTemplate: async (id: number, updates: Partial<WebsiteTemplate>): Promise<WebsiteTemplate | null> => {
    await delay(600);
    const index = DEMO_DATA.websiteTemplates.findIndex(template => template.id === id);
    if (index === -1) return null;
    
    const updatedTemplate = {
      ...DEMO_DATA.websiteTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.websiteTemplates[index] = updatedTemplate;
    return updatedTemplate;
  },
  
  deleteWebsiteTemplate: async (id: number): Promise<boolean> => {
    await delay(500);
    const index = DEMO_DATA.websiteTemplates.findIndex(template => template.id === id);
    if (index === -1) return false;
    
    DEMO_DATA.websiteTemplates.splice(index, 1);
    return true;
  },
  
  // Email Templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    await delay(500);
    return getEmailTemplates();
  },
  
  getEmailTemplateById: async (id: number): Promise<EmailTemplate | null> => {
    await delay(300);
    const template = getEmailTemplateById(id);
    return template || null;
  },
  
  getPassedEmailTemplates: async (): Promise<EmailTemplate[]> => {
    await delay(400);
    return getPassedEmailTemplates();
  },
  
  createEmailTemplate: async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> => {
    await delay(700);
    const newTemplate: EmailTemplate = {
      ...template,
      id: Math.max(...DEMO_DATA.emailTemplates.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.emailTemplates.push(newTemplate);
    return newTemplate;
  },
  
  updateEmailTemplate: async (id: number, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> => {
    await delay(600);
    const index = DEMO_DATA.emailTemplates.findIndex(template => template.id === id);
    if (index === -1) return null;
    
    const updatedTemplate = {
      ...DEMO_DATA.emailTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.emailTemplates[index] = updatedTemplate;
    return updatedTemplate;
  },
  
  deleteEmailTemplate: async (id: number): Promise<boolean> => {
    await delay(500);
    const index = DEMO_DATA.emailTemplates.findIndex(template => template.id === id);
    if (index === -1) return false;
    
    DEMO_DATA.emailTemplates.splice(index, 1);
    return true;
  },
  
  // Orders
  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    return getOrders();
  },
  
  getOrderById: async (id: number): Promise<Order | null> => {
    await delay(300);
    const order = getOrderById(id);
    return order || null;
  },
  
  getOrdersByLeadId: async (leadId: number): Promise<Order[]> => {
    await delay(400);
    return getOrdersByLeadId(leadId);
  },
  
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    await delay(700);
    const newOrder: Order = {
      ...order,
      id: Math.max(...DEMO_DATA.orders.map(o => o.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.orders.push(newOrder);
    return newOrder;
  },
  
  updateOrder: async (id: number, updates: Partial<Order>): Promise<Order | null> => {
    await delay(600);
    const index = DEMO_DATA.orders.findIndex(order => order.id === id);
    if (index === -1) return null;
    
    const updatedOrder = {
      ...DEMO_DATA.orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    DEMO_DATA.orders[index] = updatedOrder;
    return updatedOrder;
  },
  
  deleteOrder: async (id: number): Promise<boolean> => {
    await delay(500);
    const index = DEMO_DATA.orders.findIndex(order => order.id === id);
    if (index === -1) return false;
    
    DEMO_DATA.orders.splice(index, 1);
    return true;
  }
}; 