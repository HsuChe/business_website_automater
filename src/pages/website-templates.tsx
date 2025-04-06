import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { getWebsiteTemplates } from '../lib/api';
import { WebsiteTemplate } from '../lib/types';
import WebsiteTemplateForm from '../components/WebsiteTemplateForm';

export default function WebsiteTemplates() {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWebsiteTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching website templates:', error);
      setError('Failed to load website templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Templates</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus className="mr-2" /> Add Template
        </button>
      </div>
      
      {/* Templates Grid */}
      {loading ? (
        <div className="text-center p-8">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center p-8">No templates found. Create your first template!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">HTML Preview</h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                    {template.html.substring(0, 100)}...
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">CSS Preview</h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                    {template.css}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button className="text-blue-500 hover:text-blue-700" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-green-500 hover:text-green-700" title="Preview">
                    <FaEye />
                  </button>
                  <button className="text-red-500 hover:text-red-700" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Website Template</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <WebsiteTemplateForm 
              onSuccess={() => {
                setShowAddModal(false);
                fetchTemplates();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 