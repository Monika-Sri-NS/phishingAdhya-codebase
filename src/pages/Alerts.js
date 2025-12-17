import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ShieldAlert, 
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAlerts } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom'; // Ensure react-router-dom is installed

const Alerts = () => {
  const { data, loading, error } = useAlerts();
  const navigate = useNavigate();

  // Always ensure alerts is an array
  const safeAlerts = Array.isArray(data) ? data : data?.alerts ?? [];

  const [alerts, setAlerts] = useState(safeAlerts);
  const [filterSeverity, setFilterSeverity] = useState('All');

  useEffect(() => {
    setAlerts(safeAlerts);
  }, [safeAlerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => 
      filterSeverity === 'All' || alert.severity === filterSeverity
    );
  }, [alerts, filterSeverity]);

  const handleDismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'Resolved' } : a
    ));
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 border-red-200 text-red-700 icon-red-500';
      case 'High':
        return 'bg-orange-50 border-orange-200 text-orange-700 icon-orange-500';
      case 'Medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 icon-yellow-500';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700 icon-blue-500';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500 text-center p-10">Error loading alerts: {error.message}</div>;

  return (
    <div className="space-y-8 p-2 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            System Alerts
          </h1>
          <p className="text-gray-500 mt-1">Monitor and resolve critical security incidents</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          {['All', 'Critical', 'High', 'Medium'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterSeverity === severity
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => {
            const isResolved = alert.status === 'Resolved';
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-l-4 ${
                  alert.severity === 'Critical' ? 'border-l-red-500' : 
                  alert.severity === 'High' ? 'border-l-orange-500' : 
                  alert.severity === 'Medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                } hover:shadow-lg transition-shadow duration-300`}>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-4 items-start">
                      <div className={`p-3 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                        alert.severity === 'High' ? 'bg-orange-100 text-orange-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`text-lg font-bold ${isResolved ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {alert.message}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                            alert.severity === 'High' ? 'bg-orange-100 text-orange-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.severity}
                          </span>
                          {isResolved && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <CheckCircle size={10} /> Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <Clock size={14} />
                          {alert.timestamp} • Source: {alert.source || 'System Monitor'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto pl-14 md:pl-0">
                      {!isResolved ? (
                        <button 
                          onClick={() => handleResolve(alert.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Resolve
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Resolved
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDismiss(alert.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Dismiss Alert"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <CheckCircle size={64} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-xl font-bold text-gray-700">All Clear!</h3>
            <p className="text-gray-500">No alerts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;



