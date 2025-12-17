import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import InteractiveChart from '../components/ui/InteractiveChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useReports } from '../hooks/useApi';

const Reports = () => {
  const { data: reports, loading, error } = useReports();

  // ✅ FIX: always ensure array
  const safeReports = Array.isArray(reports) ? reports : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const stats = useMemo(() => ({
    total: safeReports.length,
    completed: safeReports.filter(r => r.status === 'Completed').length,
    pending: safeReports.filter(r => r.status === 'Pending').length
  }), [safeReports]);

  const chartData = useMemo(() => {
    const types = {};
    safeReports.forEach(r => {
      types[r.type] = (types[r.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [safeReports]);

  const filteredReports = useMemo(() => {
    return safeReports.filter(report => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toString().includes(searchTerm);
      const matchesFilter =
        filterStatus === 'All' || report.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [safeReports, searchTerm, filterStatus]);

  const handleDownload = (id, title) => {
    const element = document.createElement("a");
    const file = new Blob(
      [`Report ID: ${id}\nTitle: ${title}\nGenerated: ${new Date().toISOString()}`],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        Error loading reports: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 md:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">
            Security Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Analyze and export detailed security insights
          </p>
        </div>
        <button
          onClick={() => handleDownload('all', 'All_Reports')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          <Download size={18} />
          Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p>Total Reports</p>
          <h3>{stats.total}</h3>
        </Card>
        <Card>
          <p>Completed</p>
          <h3>{stats.completed}</h3>
        </Card>
        <Card>
          <p>Pending</p>
          <h3>{stats.pending}</h3>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="flex gap-4 mb-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="Search reports"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        <AnimatePresence>
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between p-3 border-b"
            >
              <div>
                <h3>{report.title}</h3>
                <p className="text-sm text-gray-500">{report.date}</p>
              </div>
              <button onClick={() => handleDownload(report.id, report.title)}>
                <Download />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReports.length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No reports found
          </p>
        )}
      </Card>

      {/* Chart */}
      <InteractiveChart
        title="Reports by Type"
        data={chartData}
        type="pie"
      />

    </div>
  );
};

export default Reports;
