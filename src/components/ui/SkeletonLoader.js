import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 bg-gray-200 dark:bg-gray-700 rounded',
    title: 'h-6 bg-gray-200 dark:bg-gray-700 rounded',
    card: 'h-32 bg-gray-200 dark:bg-gray-700 rounded-xl',
    avatar: 'w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full',
    chart: 'h-64 bg-gray-200 dark:bg-gray-700 rounded-xl'
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default SkeletonLoader;