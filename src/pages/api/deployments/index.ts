import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGetDeployments(req, res);
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling deployments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetDeployments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { leadId, status, environment } = req.query;

    const where: any = {};
    if (leadId) where.leadId = String(leadId);
    if (status) where.status = String(status);
    if (environment) where.environment = String(environment);

    const deployments = await prisma.deployment.findMany({
      where,
      include: {
        lead: true,
        template: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(deployments);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
} 