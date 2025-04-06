import { NextApiRequest, NextApiResponse } from 'next';
import { WebsiteTemplate } from '../../../lib/types';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGetTemplates(req, res);
      case 'POST':
        return handleCreateTemplate(req, res);
      case 'PUT':
        return handleUpdateTemplate(req, res);
      case 'DELETE':
        return handleDeleteTemplate(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling website templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetTemplates(req: NextApiRequest, res: NextApiResponse) {
  try {
    const templates = await prisma.websiteTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

async function handleCreateTemplate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description, html, css, thumbnail, category } = req.body;

    if (!name || !html) {
      return res.status(400).json({ error: 'Name and HTML are required' });
    }

    const template = await prisma.websiteTemplate.create({
      data: {
        name,
        description,
        html,
        css,
        thumbnail,
        category,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
}

async function handleUpdateTemplate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, description, html, css, thumbnail, category } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    if (!name || !html) {
      return res.status(400).json({ error: 'Name and HTML are required' });
    }

    const template = await prisma.websiteTemplate.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        description,
        html,
        css,
        thumbnail,
        category,
      },
    });

    res.status(200).json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
}

async function handleDeleteTemplate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    await prisma.websiteTemplate.delete({
      where: {
        id: String(id),
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
} 