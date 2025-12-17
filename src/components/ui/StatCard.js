import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      light: 'bg-blue-50 dark:bg-blue-900/20'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      light: 'bg-red-50 dark:bg-red-900/20'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      light: 'bg-green-50 dark:bg-green-900/20'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      light: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" hover>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color].light}`}>
          <div className={`${colorClasses[color].text}`}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <motion.p 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.p>
          
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' 
                ? 'text-green-600 dark:text-green-400' 
                : trend === 'down' 
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
            }`}>
              <span className="mr-1">
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;