import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`
        glass rounded-xl p-6
        ${glow ? 'neon-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`glass-dark rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};
