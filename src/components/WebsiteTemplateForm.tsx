import { useState } from 'react';
import { WebsiteTemplate } from '../lib/types';
import { createWebsiteTemplate } from '../lib/api';

interface WebsiteTemplateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function WebsiteTemplateForm({ onSuccess, onCancel }: WebsiteTemplateFormProps) {
  const [formData, setFormData] = useState<Omit<WebsiteTemplate, 'id'>>({
    name: '',
    description: '',
    html: '',
    css: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createWebsiteTemplate(formData);
      onSuccess?.();
    } catch (err) {
      setError('Failed to create website template. Please try again.');
      console.error('Error creating website template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="html" className="block text-sm font-medium text-gray-700">HTML Template</label>
        <textarea
          id="html"
          name="html"
          rows={10}
          required
          value={formData.html}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
        />
      </div>

      <div>
        <label htmlFor="css" className="block text-sm font-medium text-gray-700">CSS Styles</label>
        <textarea
          id="css"
          name="css"
          rows={10}
          required
          value={formData.css}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    </form>
  );
} 