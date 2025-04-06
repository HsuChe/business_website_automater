import { Lead, WebsiteTemplate, EmailTemplate, Order } from './types';
import * as localDb from './local-db';

// For development, always use local database
const useLocalDb = true;

/**
 * API layer that abstracts the data source (local or Supabase)
 * This allows for easy switching between development and production environments
 */

// Leads API
export const getLeads = async (): Promise<Lead[]> => {
  return localDb.getAll('leads');
};

export const getLeadById = async (id: number): Promise<Lead | null> => {
  return localDb.getById('leads', id);
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead> => {
  return localDb.create('leads', lead);
};

export const updateLead = async (id: number, lead: Partial<Lead>): Promise<Lead | null> => {
  return localDb.update('leads', id, lead);
};

export const deleteLead = async (id: number): Promise<boolean> => {
  return localDb.remove('leads', id);
};

// Website Templates API
export const getWebsiteTemplates = async (): Promise<WebsiteTemplate[]> => {
  return localDb.getAll('websiteTemplates');
};

export const getWebsiteTemplateById = async (id: number): Promise<WebsiteTemplate | null> => {
  return localDb.getById('websiteTemplates', id);
};

export const createWebsiteTemplate = async (template: Omit<WebsiteTemplate, 'id'>): Promise<WebsiteTemplate> => {
  return localDb.create('websiteTemplates', template);
};

export const updateWebsiteTemplate = async (id: number, template: Partial<WebsiteTemplate>): Promise<WebsiteTemplate | null> => {
  return localDb.update('websiteTemplates', id, template);
};

export const deleteWebsiteTemplate = async (id: number): Promise<boolean> => {
  return localDb.remove('websiteTemplates', id);
};

// Email Templates API
export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  return localDb.getAll('emailTemplates');
};

export const getEmailTemplateById = async (id: number): Promise<EmailTemplate | null> => {
  return localDb.getById('emailTemplates', id);
};

export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> => {
  return localDb.create('emailTemplates', template);
};

export const updateEmailTemplate = async (id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate | null> => {
  return localDb.update('emailTemplates', id, template);
};

export const deleteEmailTemplate = async (id: number): Promise<boolean> => {
  return localDb.remove('emailTemplates', id);
};

// Orders API
export const getOrders = async (): Promise<Order[]> => {
  return localDb.getAll('orders');
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  return localDb.getById('orders', id);
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  return localDb.create('orders', order);
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<Order | null> => {
  return localDb.update('orders', id, order);
};

export const deleteOrder = async (id: number): Promise<boolean> => {
  return localDb.remove('orders', id);
}; 