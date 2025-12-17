import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Globe, Plus, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';
import { ApiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function CertConnect() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', expiry: '' });

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCertifications();
      setCerts(data);
    } catch (error) {
      console.error("Failed to load certs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.name || !newCert.expiry) return;
    
    try {
      await ApiService.addCertification({ ...newCert, icon: 'Shield' });
      setShowAddModal(false);
      setNewCert({ name: '', expiry: '' });
      fetchCerts();
    } catch (error) {
      console.error("Failed to add cert", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Connected': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'Pending': return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'Expired': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const filteredCerts = certs.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Certificate Management
          </h1>
          <p className="text-gray-500 mt-1">Connect and manage your organization's security certifications.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Certificate
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search certifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {cert.icon === 'Shield' && <Shield className="w-6 h-6 text-blue-600" />}
                  {cert.icon === 'FileCheck' && <FileCheck className="w-6 h-6 text-purple-600" />}
                  {cert.icon === 'Globe' && <Globe className="w-6 h-6 text-emerald-600" />}
                </div>
                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                  {getStatusIcon(cert.status)}
                  {cert.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{cert.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Expires: {new Date(cert.expiry).toLocaleDateString()}</p>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Renew
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Certification</h2>
            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                <input 
                  type="text" 
                  required
                  value={newCert.name}
                  onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., ISO 27001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={newCert.expiry}
                  onChange={(e) => setNewCert({...newCert, expiry: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Add Certificate
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}