export const emailTemplates = [
  {
    id: 1,
    name: "Website Offer",
    subject: "Exclusive Website Offer for {{business_name}}",
    body: "Dear {{business_name}},\n\nWe are excited to offer you a custom website designed specifically for your business. Click the link below to view and purchase your website.\n\n{{website_preview_link}}\n\nBest regards,\nYour Website Team",
  },
  {
    id: 2,
    name: "Subscription Offer",
    subject: "Website Support Subscription for {{business_name}}",
    body: "Dear {{business_name}},\n\nEnhance your online presence with our website support subscription. Click the link below to subscribe.\n\n{{subscription_link}}\n\nBest regards,\nYour Website Team",
  },
  {
    id: 3,
    name: "Combined Offer",
    subject: "Website and Support Offer for {{business_name}}",
    body: "Dear {{business_name}},\n\nGet a custom website and ongoing support for your business. Click the links below to view and purchase.\n\n{{website_preview_link}}\n{{subscription_link}}\n\nBest regards,\nYour Website Team",
  },
]; 