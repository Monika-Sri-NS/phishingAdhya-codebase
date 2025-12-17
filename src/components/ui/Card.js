import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick, 
  gradient = false,
  variant = 'default' 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const variants = {
    default: '',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    danger: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
    warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
  };

  const cardClasses = gradient ? variants.gradient : `${baseClasses} ${variants[variant]}`;

  return (
    <motion.div
      className={`${cardClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={hover && onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;