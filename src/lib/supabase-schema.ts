import { Lead, WebsiteTemplate, EmailTemplate, Order } from './types';

/**
 * This file defines the structure of the Supabase tables for local development.
 * In a production environment, these would be created in the Supabase dashboard.
 */

// Table names
export const TABLES = {
  LEADS: 'leads',
  WEBSITE_TEMPLATES: 'website_templates',
  EMAIL_TEMPLATES: 'email_templates',
  ORDERS: 'orders',
  USERS: 'users',
  SCRAPING_CONFIGS: 'scraping_configs',
  KNOWLEDGE_BASE: 'knowledge_base',
  EMAIL_CAMPAIGNS: 'email_campaigns',
  SUBSCRIPTIONS: 'subscriptions',
};

// Table schemas
export const TABLE_SCHEMAS = {
  [TABLES.LEADS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.LEADS} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      industry TEXT,
      status TEXT NOT NULL,
      scraped_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.WEBSITE_TEMPLATES]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.WEBSITE_TEMPLATES} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      html TEXT NOT NULL,
      css TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.EMAIL_TEMPLATES]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.EMAIL_TEMPLATES} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.ORDERS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.ORDERS} (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER REFERENCES ${TABLES.LEADS}(id),
      website_template_id INTEGER REFERENCES ${TABLES.WEBSITE_TEMPLATES}(id),
      email_template_id INTEGER REFERENCES ${TABLES.EMAIL_TEMPLATES}(id),
      status TEXT NOT NULL,
      purchase_date TIMESTAMP WITH TIME ZONE,
      subscription_status TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.USERS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.SCRAPING_CONFIGS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.SCRAPING_CONFIGS} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_url TEXT,
      source_credentials JSONB,
      scraping_frequency TEXT,
      last_scraped_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.KNOWLEDGE_BASE]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.KNOWLEDGE_BASE} (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT,
      tags TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.EMAIL_CAMPAIGNS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.EMAIL_CAMPAIGNS} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email_template_id INTEGER REFERENCES ${TABLES.EMAIL_TEMPLATES}(id),
      website_template_id INTEGER REFERENCES ${TABLES.WEBSITE_TEMPLATES}(id),
      pricing JSONB,
      subscription_options JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  [TABLES.SUBSCRIPTIONS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.SUBSCRIPTIONS} (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES ${TABLES.ORDERS}(id),
      plan_name TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      billing_cycle TEXT NOT NULL,
      start_date TIMESTAMP WITH TIME ZONE NOT NULL,
      end_date TIMESTAMP WITH TIME ZONE,
      status TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};

// Sample data for local development
export const SAMPLE_DATA = {
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
  ],
  website_templates: [
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
  ],
  email_templates: [
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
  ],
  [TABLES.ORDERS]: [
    {
      id: 1,
      lead_id: 1,
      website_template_id: 1,
      email_template_id: 1,
      status: "Purchased",
      purchase_date: "2023-01-01",
      subscription_status: "Active",
    },
    {
      id: 2,
      lead_id: 2,
      website_template_id: 2,
      email_template_id: 2,
      status: "Pending",
      purchase_date: null,
      subscription_status: "Inactive",
    },
    {
      id: 3,
      lead_id: 3,
      website_template_id: 3,
      email_template_id: 3,
      status: "Purchased",
      purchase_date: "2023-02-01",
      subscription_status: "Active",
    },
  ] as Order[],
  
  [TABLES.USERS]: [
    {
      id: 1,
      email: "admin@example.com",
      password_hash: "hashed_password_here",
      role: "admin",
    },
    {
      id: 2,
      email: "user@example.com",
      password_hash: "hashed_password_here",
      role: "user",
    },
  ],
  
  [TABLES.SCRAPING_CONFIGS]: [
    {
      id: 1,
      name: "Google Business",
      source_type: "google_business",
      source_url: "https://www.google.com/business",
      source_credentials: {
        api_key: "your_api_key_here",
      },
      scraping_frequency: "daily",
      last_scraped_at: null,
    },
    {
      id: 2,
      name: "LinkedIn Companies",
      source_type: "linkedin",
      source_url: "https://www.linkedin.com/company",
      source_credentials: {
        api_key: "your_api_key_here",
      },
      scraping_frequency: "weekly",
      last_scraped_at: null,
    },
  ],
  
  [TABLES.KNOWLEDGE_BASE]: [
    {
      id: 1,
      title: "Website Design Best Practices",
      content: "A comprehensive guide to creating effective business websites.",
      category: "Design",
      tags: ["web design", "best practices", "UI/UX"],
    },
    {
      id: 2,
      title: "SEO Optimization Guide",
      content: "Tips and techniques for optimizing your website for search engines.",
      category: "Marketing",
      tags: ["SEO", "search engines", "optimization"],
    },
  ],
  
  [TABLES.EMAIL_CAMPAIGNS]: [
    {
      id: 1,
      name: "Basic Website Offer",
      email_template_id: 1,
      website_template_id: 1,
      pricing: {
        website_price: 499,
        currency: "USD",
      },
      subscription_options: {
        basic: {
          name: "Basic Support",
          price: 49,
          features: ["Monthly Updates", "Email Support"],
        },
        premium: {
          name: "Premium Support",
          price: 99,
          features: ["Weekly Updates", "Priority Support", "SEO Optimization"],
        },
      },
    },
    {
      id: 2,
      name: "Premium Website Offer",
      email_template_id: 3,
      website_template_id: 2,
      pricing: {
        website_price: 999,
        currency: "USD",
      },
      subscription_options: {
        basic: {
          name: "Basic Support",
          price: 79,
          features: ["Monthly Updates", "Email Support"],
        },
        premium: {
          name: "Premium Support",
          price: 149,
          features: ["Weekly Updates", "Priority Support", "SEO Optimization"],
        },
      },
    },
  ],
  
  [TABLES.SUBSCRIPTIONS]: [
    {
      id: 1,
      order_id: 1,
      plan_name: "Premium Support",
      price: 99.00,
      billing_cycle: "monthly",
      start_date: "2023-01-01",
      end_date: null,
      status: "active",
    },
    {
      id: 2,
      order_id: 3,
      plan_name: "Basic Support",
      price: 49.00,
      billing_cycle: "monthly",
      start_date: "2023-02-01",
      end_date: null,
      status: "active",
    },
  ],
}; 