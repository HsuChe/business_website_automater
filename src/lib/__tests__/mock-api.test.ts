import { mockApi } from '../mock-api';
import { DEMO_DATA } from '../demo-data';

// Mock the setTimeout function to avoid waiting
jest.useFakeTimers();

describe('mockApi', () => {
  // Reset the demo data before each test
  beforeEach(() => {
    // We can't directly reset the DEMO_DATA object, but we can clear the arrays
    DEMO_DATA.leads = [...DEMO_DATA.leads];
    DEMO_DATA.websiteTemplates = [...DEMO_DATA.websiteTemplates];
    DEMO_DATA.emailTemplates = [...DEMO_DATA.emailTemplates];
    DEMO_DATA.orders = [...DEMO_DATA.orders];
  });

  describe('Leads API', () => {
    it('should get all leads', async () => {
      const getLeadsPromise = mockApi.getLeads();
      jest.runAllTimers();
      const leads = await getLeadsPromise;
      
      expect(leads).toEqual(DEMO_DATA.leads);
    });

    it('should get a lead by id', async () => {
      const leadId = DEMO_DATA.leads[0].id;
      const getLeadByIdPromise = mockApi.getLeadById(leadId);
      jest.runAllTimers();
      const lead = await getLeadByIdPromise;
      
      expect(lead).toEqual(DEMO_DATA.leads[0]);
    });

    it('should create a new lead', async () => {
      const newLead = {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '555-123-4567',
        company: 'Test Company',
        industry: 'Technology',
        status: 'Pending Enrichment',
        description: 'Test description'
      };
      
      const createLeadPromise = mockApi.createLead(newLead);
      jest.runAllTimers();
      const createdLead = await createLeadPromise;
      
      expect(createdLead.id).toBeDefined();
      expect(createdLead.name).toBe(newLead.name);
      expect(createdLead.email).toBe(newLead.email);
      expect(DEMO_DATA.leads).toContainEqual(createdLead);
    });

    it('should update a lead', async () => {
      const leadId = DEMO_DATA.leads[0].id;
      const updates = { name: 'Updated Name' };
      
      const updateLeadPromise = mockApi.updateLead(leadId, updates);
      jest.runAllTimers();
      const updatedLead = await updateLeadPromise;
      
      expect(updatedLead).not.toBeNull();
      expect(updatedLead?.name).toBe(updates.name);
      expect(updatedLead?.id).toBe(leadId);
    });

    it('should delete a lead', async () => {
      const leadId = DEMO_DATA.leads[0].id;
      const initialLength = DEMO_DATA.leads.length;
      
      const deleteLeadPromise = mockApi.deleteLead(leadId);
      jest.runAllTimers();
      const result = await deleteLeadPromise;
      
      expect(result).toBe(true);
      expect(DEMO_DATA.leads.length).toBe(initialLength - 1);
      expect(DEMO_DATA.leads.find(lead => lead.id === leadId)).toBeUndefined();
    });
  });

  describe('Website Templates API', () => {
    it('should get all website templates', async () => {
      const getWebsiteTemplatesPromise = mockApi.getWebsiteTemplates();
      jest.runAllTimers();
      const templates = await getWebsiteTemplatesPromise;
      
      expect(templates).toEqual(DEMO_DATA.websiteTemplates);
    });

    it('should get passed website templates', async () => {
      const getPassedWebsiteTemplatesPromise = mockApi.getPassedWebsiteTemplates();
      jest.runAllTimers();
      const templates = await getPassedWebsiteTemplatesPromise;
      
      expect(templates.every(template => template.testStatus === 'passed')).toBe(true);
    });
  });

  describe('Email Templates API', () => {
    it('should get all email templates', async () => {
      const getEmailTemplatesPromise = mockApi.getEmailTemplates();
      jest.runAllTimers();
      const templates = await getEmailTemplatesPromise;
      
      expect(templates).toEqual(DEMO_DATA.emailTemplates);
    });

    it('should get passed email templates', async () => {
      const getPassedEmailTemplatesPromise = mockApi.getPassedEmailTemplates();
      jest.runAllTimers();
      const templates = await getPassedEmailTemplatesPromise;
      
      expect(templates.every(template => template.testStatus === 'passed')).toBe(true);
    });
  });

  describe('Orders API', () => {
    it('should get all orders', async () => {
      const getOrdersPromise = mockApi.getOrders();
      jest.runAllTimers();
      const orders = await getOrdersPromise;
      
      expect(orders).toEqual(DEMO_DATA.orders);
    });

    it('should get orders by lead id', async () => {
      const leadId = DEMO_DATA.orders[0].leadId;
      const getOrdersByLeadIdPromise = mockApi.getOrdersByLeadId(leadId);
      jest.runAllTimers();
      const orders = await getOrdersByLeadIdPromise;
      
      expect(orders.every(order => order.leadId === leadId)).toBe(true);
    });
  });
}); 