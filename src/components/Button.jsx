import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-neon-cyan hover:bg-neon-magenta text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-700',
    outline: 'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
    ghost: 'text-slate-700 dark:text-gray-200 hover:bg-slate-100/70 dark:hover:bg-white/5',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        font-medium rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};
