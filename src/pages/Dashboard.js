import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Link2, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Shield,
  Clock,
  Users,
  Server,
  Database
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import InteractiveChart from '../components/ui/InteractiveChart';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useDashboardStats, usePhishingTrends } from '../hooks/useApi';
import { ApiService } from '../services/api';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: trends, loading: trendsLoading } = usePhishingTrends(timeRange);
  const [systemStatus, setSystemStatus] = useState({ status: 'checking', database: 'checking' });

  useEffect(() => {
    const checkStatus = async () => {
      const status = await ApiService.checkHealth();
      setSystemStatus(status);
    };
    
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for demo - replace with actual API data
  const mockStats = [
    {
      title: "Total URLs Analyzed",
      value: 15234,
      icon: <Link2 className="w-6 h-6" />,
      color: "blue",
      trend: "up",
      trendValue: "+12.5%"
    },
    {
      title: "Phishing Detected",
      value: 204,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "red",
      trend: "down",
      trendValue: "-8.2%"
    },
    {
      title: "Safe URLs",
      value: 15030,
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "green",
      trend: "up",
      trendValue: "+15.3%"
    },
    {
      title: "Active Alerts",
      value: 45,
      icon: <Bell className="w-6 h-6" />,
      color: "yellow",
      trend: "down",
      trendValue: "-5.1%"
    }
  ];

  const mockTrendData = [
    { name: 'Mon', value: 12, safe: 145, threats: 8 },
    { name: 'Tue', value: 19, safe: 167, threats: 12 },
    { name: 'Wed', value: 8, safe: 134, threats: 5 },
    { name: 'Thu', value: 15, safe: 189, threats: 9 },
    { name: 'Fri', value: 23, safe: 156, threats: 18 },
    { name: 'Sat', value: 11, safe: 98, threats: 7 },
    { name: 'Sun', value: 16, safe: 123, threats: 11 }
  ];

  const mockThreatDistribution = [
    { name: 'Phishing', value: 45, color: '#EF4444' },
    { name: 'Malware', value: 30, color: '#F59E0B' },
    { name: 'Suspicious', value: 20, color: '#8B5CF6' },
    { name: 'Safe', value: 5, color: '#10B981' }
  ];

  const mockRecentActivity = [
    {
      id: 1,
      type: 'threat_detected',
      message: 'High-risk phishing attempt blocked',
      timestamp: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'scan_completed',
      message: 'Scheduled URL scan completed successfully',
      timestamp: '15 minutes ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'user_reported',
      message: 'User reported suspicious email',
      timestamp: '1 hour ago',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'system_update',
      message: 'Threat database updated with 1,247 new signatures',
      timestamp: '2 hours ago',
      severity: 'low'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'threat_detected': return <Shield className="w-4 h-4" />;
      case 'scan_completed': return <Eye className="w-4 h-4" />;
      case 'user_reported': return <Users className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time threat monitoring and analysis
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          {/* System Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <div className={`w-2.5 h-2.5 rounded-full ${systemStatus.status === 'ok' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {systemStatus.status === 'ok' ? 'System Online' : 'System Offline'}
            </span>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              trendValue={stat.trendValue}
              loading={statsLoading}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart
          data={mockTrendData}
          type="line"
          title="Threat Detection Trends"
          height={350}
          loading={trendsLoading}
          colors={['#EF4444', '#10B981', '#F59E0B']}
        />
        
        <InteractiveChart
          data={mockThreatDistribution}
          type="pie"
          title="Threat Distribution"
          height={350}
          colors={['#EF4444', '#F59E0B', '#8B5CF6', '#10B981']}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Run URL Scan
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                <AlertTriangle className="w-4 h-4 mr-2" />
                View Alerts
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>

            {/* System Status Detail */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                System Health
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Server size={14} /> API Status
                  </span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={systemStatus.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                      {systemStatus.status === 'ok' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Database size={14} /> Database
                  </span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={systemStatus.database === 'connected' ? 'text-green-600' : 'text-red-600'}>
                      {systemStatus.database === 'connected' ? 'Healthy' : 'Error'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;