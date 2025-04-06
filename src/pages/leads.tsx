import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEnvelope, FaFileCode } from 'react-icons/fa';
import { useApi } from '../lib/api-context';
import { Lead } from '../lib/types';
import LeadForm from '../components/LeadForm';
import LeadsTable from '../components/LeadsTable';
import LeadsFilters from '../components/LeadsFilters';
import WebsiteGenerationModal from '../components/WebsiteGenerationModal';

export default function Leads() {
  const api = useApi();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLeads();
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to load leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on search term and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (lead.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter.length === 0 || (lead.industry && industryFilter.includes(lead.industry));
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(lead.status);
    
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  // Get unique industries for filter dropdown
  const industries = [...new Set(leads.map(lead => lead.industry).filter(Boolean))];
  
  // Get unique statuses for filter dropdown
  const statuses = [...new Set(leads.map(lead => lead.status))];

  const handleSelectLead = (leadId: number, selected: boolean) => {
    if (selected) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleEditLead = (lead: Lead) => {
    // TODO: Implement edit functionality
    console.log('Edit lead:', lead);
  };

  const handleGenerateWebsite = (lead: Lead) => {
    setSelectedLead(lead);
    setShowWebsiteModal(true);
  };

  const handleSendEmail = (lead: Lead) => {
    // TODO: Implement email sending
    console.log('Send email to lead:', lead);
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
      try {
        await api.deleteLead(lead.id);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setIndustryFilter([]);
    setStatusFilter([]);
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
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex space-x-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="mr-2" /> Add Lead
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center">
            <FaPlus className="mr-2" /> Import Leads
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <LeadsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        industryFilter={industryFilter}
        onIndustryFilterChange={setIndustryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        industries={industries}
        statuses={statuses}
        onResetFilters={handleResetFilters}
      />
      
      {/* Leads Table */}
      <LeadsTable
        leads={filteredLeads}
        loading={loading}
        onEdit={handleEditLead}
        onGenerateWebsite={handleGenerateWebsite}
        onSendEmail={handleSendEmail}
        onDelete={handleDeleteLead}
        selectedLeads={selectedLeads}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
      />

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Lead</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <LeadForm 
              onSuccess={() => {
                setShowAddModal(false);
                fetchLeads();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Website Generation Modal */}
      {selectedLead && (
        <WebsiteGenerationModal
          open={showWebsiteModal}
          onClose={() => {
            setShowWebsiteModal(false);
            setSelectedLead(null);
          }}
          lead={selectedLead}
          onSuccess={() => {
            fetchLeads();
          }}
        />
      )}
    </div>
  );
} 