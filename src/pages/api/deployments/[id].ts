import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Deployment ID is required' });
    }

    switch (req.method) {
      case 'GET':
        return handleGetDeployment(req, res);
      case 'PUT':
        return handleUpdateDeployment(req, res);
      case 'DELETE':
        return handleDeleteDeployment(req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling deployment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetDeployment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const deployment = await prisma.deployment.findUnique({
      where: {
        id: String(id),
      },
      include: {
        lead: true,
        template: true,
      },
    });

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.status(200).json(deployment);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    res.status(500).json({ error: 'Failed to fetch deployment' });
  }
}

async function handleUpdateDeployment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { status, environment, subdomain, url } = req.body;

    const deployment = await prisma.deployment.update({
      where: {
        id: String(id),
      },
      data: {
        status,
        environment,
        subdomain,
        url,
      },
      include: {
        lead: true,
        template: true,
      },
    });

    res.status(200).json(deployment);
  } catch (error) {
    console.error('Error updating deployment:', error);
    res.status(500).json({ error: 'Failed to update deployment' });
  }
}

async function handleDeleteDeployment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    await prisma.deployment.delete({
      where: {
        id: String(id),
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting deployment:', error);
    res.status(500).json({ error: 'Failed to delete deployment' });
  }
} 