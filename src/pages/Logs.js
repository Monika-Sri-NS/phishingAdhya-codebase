import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Terminal,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLogs } from '../hooks/useApi';

const Logs = () => {
  const { data, loading, error } = useLogs();

  // 🔧 FIX: always ensure logs is an array
  const logs = Array.isArray(data) ? data : data?.logs ?? [];

  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = logLevel === 'All' || log.level === logLevel;
      return matchesSearch && matchesLevel;
    });
  }, [logs, searchTerm, logLevel]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLevelBadge = (level) => {
    switch (level) {
      case 'Error':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
            <AlertCircle size={12} /> Error
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
            <AlertTriangle size={12} /> Warning
          </span>
        );
      case 'Success':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Success
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
            <Info size={12} /> Info
          </span>
        );
    }
  };

  const handleExport = () => {
    const content = filteredLogs
      .map(l => `[${l.timestamp}] [${l.level}] ${l.source}: ${l.message}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-10">
        Error loading logs
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-900 to-black dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <Terminal />
            System Logs
          </h1>
          <p className="text-gray-500 mt-1">
            Audit trail and system activity records
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800"
        >
          <Download size={18} />
          Export Logs
        </button>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="All">All Levels</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
              <option value="Success">Success</option>
            </select>
          </div>
        </div>

        {/* Logs */}
        <div className="divide-y">
          {currentLogs.length > 0 ? (
            currentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="grid md:grid-cols-12 gap-4 p-4"
              >
                <div className="md:col-span-2 text-xs text-gray-500 font-mono">
                  {log.timestamp}
                </div>
                <div className="md:col-span-2">
                  {getLevelBadge(log.level)}
                </div>
                <div className="md:col-span-2 font-medium">
                  {log.source}
                </div>
                <div className="md:col-span-6 text-gray-600">
                  {log.message}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              No logs found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <ChevronLeft />
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Logs;

