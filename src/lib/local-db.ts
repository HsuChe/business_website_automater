import { TABLES, SAMPLE_DATA } from './supabase-schema';
import { Lead, WebsiteTemplate, EmailTemplate, Order } from './types';

/**
 * This file provides utility functions for working with the local dummy data
 * during development. In a production environment, these would be replaced
 * with actual Supabase API calls.
 */

// In-memory database for local development
let localDb = { ...SAMPLE_DATA };

// Generic CRUD operations
export async function getAll<T>(table: string): Promise<T[]> {
  return localDb[table] as T[];
}

export async function getById<T>(table: string, id: number): Promise<T | null> {
  const items = localDb[table] as T[];
  return items.find((item: any) => item.id === id) || null;
}

export async function create<T>(table: string, data: Omit<T, 'id'>): Promise<T> {
  const items = localDb[table] as T[];
  const newId = Math.max(...items.map((item: any) => item.id)) + 1;
  const newItem = { ...data, id: newId } as T;
  localDb[table] = [...items, newItem];
  return newItem;
}

export async function update<T>(table: string, id: number, data: Partial<T>): Promise<T | null> {
  const items = localDb[table] as T[];
  const index = items.findIndex((item: any) => item.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = { ...items[index], ...data } as T;
  localDb[table] = [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
  
  return updatedItem;
}

export async function remove(table: string, id: number): Promise<boolean> {
  const items = localDb[table] as any[];
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  localDb[table] = [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];
  
  return true;
}

// Table-specific operations
export async function getLeads(): Promise<Lead[]> {
  return getAll<Lead>(TABLES.LEADS);
}

export async function getLeadById(id: number): Promise<Lead | null> {
  return getById<Lead>(TABLES.LEADS, id);
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  return create<Lead>(TABLES.LEADS, lead);
}

export async function updateLead(id: number, lead: Partial<Lead>): Promise<Lead | null> {
  return update<Lead>(TABLES.LEADS, id, lead);
}

export async function deleteLead(id: number): Promise<boolean> {
  return remove(TABLES.LEADS, id);
}

export async function getWebsiteTemplates(): Promise<WebsiteTemplate[]> {
  return getAll<WebsiteTemplate>(TABLES.WEBSITE_TEMPLATES);
}

export async function getWebsiteTemplateById(id: number): Promise<WebsiteTemplate | null> {
  return getById<WebsiteTemplate>(TABLES.WEBSITE_TEMPLATES, id);
}

export async function createWebsiteTemplate(template: Omit<WebsiteTemplate, 'id'>): Promise<WebsiteTemplate> {
  return create<WebsiteTemplate>(TABLES.WEBSITE_TEMPLATES, template);
}

export async function updateWebsiteTemplate(id: number, template: Partial<WebsiteTemplate>): Promise<WebsiteTemplate | null> {
  return update<WebsiteTemplate>(TABLES.WEBSITE_TEMPLATES, id, template);
}

export async function deleteWebsiteTemplate(id: number): Promise<boolean> {
  return remove(TABLES.WEBSITE_TEMPLATES, id);
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  return getAll<EmailTemplate>(TABLES.EMAIL_TEMPLATES);
}

export async function getEmailTemplateById(id: number): Promise<EmailTemplate | null> {
  return getById<EmailTemplate>(TABLES.EMAIL_TEMPLATES, id);
}

export async function createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
  return create<EmailTemplate>(TABLES.EMAIL_TEMPLATES, template);
}

export async function updateEmailTemplate(id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
  return update<EmailTemplate>(TABLES.EMAIL_TEMPLATES, id, template);
}

export async function deleteEmailTemplate(id: number): Promise<boolean> {
  return remove(TABLES.EMAIL_TEMPLATES, id);
}

export async function getOrders(): Promise<Order[]> {
  return getAll<Order>(TABLES.ORDERS);
}

export async function getOrderById(id: number): Promise<Order | null> {
  return getById<Order>(TABLES.ORDERS, id);
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<Order> {
  return create<Order>(TABLES.ORDERS, order);
}

export async function updateOrder(id: number, order: Partial<Order>): Promise<Order | null> {
  return update<Order>(TABLES.ORDERS, id, order);
}

export async function deleteOrder(id: number): Promise<boolean> {
  return remove(TABLES.ORDERS, id);
}

// Reset the local database to its initial state
export function resetLocalDb(): void {
  localDb = { ...SAMPLE_DATA };
} 