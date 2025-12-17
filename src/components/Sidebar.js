import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, Activity, Settings, Shield, User } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/alerts', icon: <AlertTriangle size={20} />, label: 'Threat Alerts' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/logs', icon: <Activity size={20} />, label: 'System Logs' },
    { path: '/cert-connect', icon: <Shield size={20} />, label: 'Cert Connect' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex-shrink-0 flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white">
          <Shield className="text-blue-600" />
          <span>SecureGuard</span>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <span className="mr-3 group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h4 className="font-bold text-sm mb-1">Pro Protection</h4>
          <p className="text-xs text-blue-100 mb-3">Your organization is protected by active monitoring.</p>
          <div className="flex items-center text-xs font-semibold bg-white/20 rounded-lg px-2 py-1 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Active
          </div>
        </div>
      </div>
    </aside>
  );
}