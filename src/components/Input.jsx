import React from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  error,
  icon: Icon,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-lg
            px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500
            focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/15
            transition-colors duration-200
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({ 
  label, 
  placeholder, 
  value, 
  onChange,
  error,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-lg
          px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500
          focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/15
          transition-colors duration-200 resize-none
          ${error ? 'border-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
