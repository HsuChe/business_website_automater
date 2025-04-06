import { Lead, WebsiteTemplate, EmailTemplate, Order } from './types';

// Demo data for development and testing
export const DEMO_DATA = {
  leads: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      company: 'Smith Consulting',
      industry: 'Consulting',
      status: 'Pending Enrichment',
      description: 'Interested in a professional website for their consulting business.',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-987-6543',
      company: 'Doe Bakery',
      industry: 'Food & Beverage',
      status: 'Ready for Website Gen',
      description: 'Looking for an e-commerce website to sell baked goods online.',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '555-456-7890',
      company: 'Johnson Plumbing',
      industry: 'Home Services',
      status: 'Website Generated',
      description: 'Needs a simple website to showcase their plumbing services and contact information.',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '555-789-0123',
      company: 'Brown Law Firm',
      industry: 'Legal',
      status: 'Pending Enrichment',
      description: 'Interested in a professional website for their law firm with client testimonials.',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      phone: '555-234-5678',
      company: 'Wilson Fitness',
      industry: 'Health & Fitness',
      status: 'Ready for Website Gen',
      description: 'Looking for a website with class schedules and online booking capabilities.',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z'
    }
  ] as Lead[],
  
  websiteTemplates: [
    {
      id: 1,
      name: 'Professional Business',
      description: 'A clean, professional template for business websites',
      html: '<!DOCTYPE html><html><head><title>{company}</title></head><body><h1>Welcome to {company}</h1><p>We provide excellent services.</p></body></html>',
      css: 'body { font-family: Arial, sans-serif; } h1 { color: #333; }',
      testStatus: 'passed',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      description: 'A template for online stores with product listings',
      html: '<!DOCTYPE html><html><head><title>{company} - Shop</title></head><body><h1>{company} Store</h1><div class="products"></div></body></html>',
      css: 'body { font-family: Arial, sans-serif; } .products { display: grid; grid-template-columns: repeat(3, 1fr); }',
      testStatus: 'passed',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'Portfolio',
      description: 'A template for showcasing work and projects',
      html: '<!DOCTYPE html><html><head><title>{company} - Portfolio</title></head><body><h1>Our Work</h1><div class="portfolio"></div></body></html>',
      css: 'body { font-family: Arial, sans-serif; } .portfolio { display: grid; grid-template-columns: repeat(2, 1fr); }',
      testStatus: 'pending',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    }
  ] as WebsiteTemplate[],
  
  emailTemplates: [
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to {company}!',
      body: `Dear {name},

Welcome to {company}! We're excited to have you on board.

Your website is now live at: {website}

If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
The {company} Team`,
      testStatus: 'passed',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Website Launch Announcement',
      subject: 'Your {company} Website is Live!',
      body: `Hi {name},

Great news! Your new website for {company} is now live and ready to go.

You can visit your website at: {website}

We've included all the features we discussed:
- Modern, responsive design
- SEO optimization
- Contact form
- Social media integration

Take a look and let us know if you'd like any adjustments.

Best regards,
Your Website Team`,
      testStatus: 'passed',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'Follow-up Email',
      subject: "How's your {company} website working for you?",
      body: `Hello {name},

I hope you're enjoying your new website for {company}! It's been a week since the launch, and I wanted to check in to see how things are going.

Your website: {website}

Is there anything specific you'd like to improve or any features you'd like to add?

We're here to help make your website even better!

Best regards,
Your Website Team`,
      testStatus: 'pending',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    }
  ] as EmailTemplate[],
  
  orders: [
    {
      id: 1,
      leadId: 1,
      websiteTemplateId: 1,
      emailTemplateId: 1,
      status: 'Purchased',
      purchaseDate: '2024-01-10T00:00:00Z',
      subscriptionStatus: 'Active',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 2,
      leadId: 2,
      websiteTemplateId: 2,
      emailTemplateId: 2,
      status: 'Pending',
      purchaseDate: null,
      subscriptionStatus: 'Inactive',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 3,
      leadId: 3,
      websiteTemplateId: 3,
      emailTemplateId: 3,
      status: 'Purchased',
      purchaseDate: '2024-01-20T00:00:00Z',
      subscriptionStatus: 'Active',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ] as Order[]
};

// Helper functions for working with demo data
export const getLeads = (): Lead[] => {
  return DEMO_DATA.leads;
};

export const getWebsiteTemplates = (): WebsiteTemplate[] => {
  return DEMO_DATA.websiteTemplates;
};

export const getEmailTemplates = (): EmailTemplate[] => {
  return DEMO_DATA.emailTemplates;
};

export const getOrders = (): Order[] => {
  return DEMO_DATA.orders;
};

export const getLeadById = (id: number): Lead | undefined => {
  return DEMO_DATA.leads.find(lead => lead.id === id);
};

export const getWebsiteTemplateById = (id: number): WebsiteTemplate | undefined => {
  return DEMO_DATA.websiteTemplates.find(template => template.id === id);
};

export const getEmailTemplateById = (id: number): EmailTemplate | undefined => {
  return DEMO_DATA.emailTemplates.find(template => template.id === id);
};

export const getOrderById = (id: number): Order | undefined => {
  return DEMO_DATA.orders.find(order => order.id === id);
};

export const getOrdersByLeadId = (leadId: number): Order[] => {
  return DEMO_DATA.orders.filter(order => order.leadId === leadId);
};

export const getPassedWebsiteTemplates = (): WebsiteTemplate[] => {
  return DEMO_DATA.websiteTemplates.filter(template => template.testStatus === 'passed');
};

export const getPassedEmailTemplates = (): EmailTemplate[] => {
  return DEMO_DATA.emailTemplates.filter(template => template.testStatus === 'passed');
}; 