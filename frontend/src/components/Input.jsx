import React from 'react';

const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    />
);

export default Input;
