import React from 'react';

const Label = ({ children, htmlFor, className = '' }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}>
        {children}
    </label>
);

export default Label;
