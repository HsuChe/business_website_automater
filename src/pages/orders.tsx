import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { getOrders, getLeads, getWebsiteTemplates, getEmailTemplates } from '../lib/api';
import { Order, Lead, WebsiteTemplate, EmailTemplate } from '../lib/types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [websiteTemplates, setWebsiteTemplates] = useState<WebsiteTemplate[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ordersData, leadsData, websiteTemplatesData, emailTemplatesData] = await Promise.all([
          getOrders(),
          getLeads(),
          getWebsiteTemplates(),
          getEmailTemplates()
        ]);
        
        setOrders(ordersData || []);
        setLeads(leadsData || []);
        setWebsiteTemplates(websiteTemplatesData || []);
        setEmailTemplates(emailTemplatesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load orders data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get lead name by ID
  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Unknown Lead';
  };
  
  // Helper function to get template name by ID
  const getTemplateName = (templateId: number, type: 'website' | 'email') => {
    const templates = type === 'website' ? websiteTemplates : emailTemplates;
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const leadName = getLeadName(order.leadId).toLowerCase();
    const matchesSearch = leadName.includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesSubscription = !subscriptionFilter || order.subscriptionStatus === subscriptionFilter;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  // Get unique statuses for filter dropdown
  const statuses = [...new Set(orders.map(order => order.status))];
  
  // Get unique subscription statuses for filter dropdown
  const subscriptionStatuses = [...new Set(orders.map(order => order.subscriptionStatus))];

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
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <select 
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select 
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
            >
              <option value="">All Subscriptions</option>
              {subscriptionStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">No orders found matching your criteria.</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website Template</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Template</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getLeadName(order.leadId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTemplateName(order.websiteTemplateId, 'website')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTemplateName(order.emailTemplateId, 'email')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Purchased' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.purchaseDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.subscriptionStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700" title="View Details">
                        <FaEye />
                      </button>
                      {order.status === 'Pending' && (
                        <>
                          <button className="text-green-500 hover:text-green-700" title="Approve">
                            <FaCheck />
                          </button>
                          <button className="text-red-500 hover:text-red-700" title="Reject">
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 