import { NextApiRequest, NextApiResponse } from 'next';
import { WebsiteGenerator } from '../../lib/services/website-generator';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { templateId, leadId, llmProvider } = req.body;

    if (!templateId || !leadId) {
      return res.status(400).json({ error: 'Template ID and Lead ID are required' });
    }

    // Fetch template and lead data
    const [template, lead] = await Promise.all([
      prisma.websiteTemplate.findUnique({
        where: { id: templateId },
      }),
      prisma.lead.findUnique({
        where: { id: leadId },
      }),
    ]);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Generate website
    const generator = new WebsiteGenerator(llmProvider);
    const html = await generator.generateWebsite(template, lead);

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        leadId,
        templateId,
        html,
        status: 'pending',
        environment: 'development',
      },
    });

    res.status(200).json({
      success: true,
      deployment,
    });
  } catch (error) {
    console.error('Error generating website:', error);
    res.status(500).json({ error: 'Failed to generate website' });
  }
} 