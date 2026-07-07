import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAlerts } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

const Alerts = () => {
  const { data, loading, error } = useAlerts();
  const navigate = useNavigate();

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

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500 text-center p-10">Error loading alerts</div>;

  return (
    <div className="space-y-8 p-2 md:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            System Alerts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and resolve critical security incidents
          </p>
        </div>

        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          {['All', 'Critical', 'High', 'Medium'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterSeverity === severity
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* ALERT LIST */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => {
            const isResolved = alert.status === 'Resolved';

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-l-4 ${
                  alert.severity === 'Critical' ? 'border-l-red-500' :
                  alert.severity === 'High' ? 'border-l-orange-500' :
                  alert.severity === 'Medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>

                  <div className="flex justify-between items-center gap-4">

                    {/* LEFT */}
                    <div className="flex items-center gap-4">

                      <div className={`p-3 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                        alert.severity === 'High' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle size={20} />
                      </div>

                      <div>

                        {/* TEXT FIXED */}
                        <h3 className={`text-base font-semibold ${
                          isResolved
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          {alert.message}
                        </h3>

                        {/* TIMESTAMP FIXED */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                          <Clock size={14} />
                          {alert.timestamp} • Source: {alert.source}
                        </p>

                      </div>
                    </div>

                    {/* RIGHT SIDE (BADGE + BUTTONS) */}
                    <div className="flex items-center gap-3">

                      {/* 🔥 BADGE RESTORED */}
                      <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                        alert.severity === 'Critical'
                          ? 'bg-red-100 text-red-600'
                          : alert.severity === 'High'
                          ? 'bg-orange-100 text-orange-600'
                          : alert.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {alert.severity?.toUpperCase()}
                      </span>

                      {/* BUTTON */}
                      {!isResolved ? (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg"
                        >
                          Resolved
                        </button>
                      )}

                      {/* CLOSE */}
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="text-gray-400 hover:text-red-500"
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
      </div>
    </div>
  );
};

export default Alerts;


