import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- ICONS (as inline SVG components for simplicity) ---
const HomeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileTextIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

const ClockIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ChartBarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 12h4v4H7z" />
        <path d="M12 8h4v8h-4z" />
        <path d="M17 4h4v12h-4z" />
    </svg>
);

const DollarSignIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const EditIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);


const SettingsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SunIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
);

const MoonIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const MenuIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const LogOutIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const GoogleIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const TeamIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const RepeatIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 2 4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="m7 22-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
);


// --- MOCK DATA, CONSTANTS & HELPERS ---
const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const formatCurrency = (amount, currencyCode = 'USD') => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    } catch (e) {
        // Fallback for invalid currency codes
        const currency = CURRENCIES.find(c => c.code === currencyCode);
        return `${currency ? currency.symbol : '$'}${amount.toFixed(2)}`;
    }
};

const initialClients = [
    { id: 1, name: 'Innovate Inc.', email: 'contact@innovate.com', projects: 2 },
    { id: 2, name: 'Quantum Solutions', email: 'hello@quantum.dev', projects: 1 },
    { id: 3, name: 'Apex Designs', email: 'support@apexdesigns.io', projects: 3 },
];

const initialProjects = [
    { id: 1, name: 'Mobile App Redesign', client: 'Apex Designs', status: 'In Progress', tracked: 25.5, assignedTo: 2, billing: { type: 'Hourly', rate: 120 }, budget: null, currency: 'USD', tasks: [
        { id: 101, title: 'Create wireframes for main screens', description: 'Use Figma to create high-fidelity wireframes for the dashboard, projects, and invoice pages.', status: 'Done', assignedTo: 2 },
        { id: 102, title: 'Develop component library', description: 'Build reusable React components for buttons, cards, and dialogs based on shadcn/ui.', status: 'In Progress', assignedTo: 2 },
        { id: 103, title: 'User testing session setup', description: 'Recruit 5 users and schedule testing sessions for next week.', status: 'To Do', assignedTo: 1 },
    ]},
    { id: 2, name: 'E-commerce Platform', client: 'Innovate Inc.', status: 'Completed', tracked: 120, assignedTo: 1, billing: { type: 'Fixed Price'}, budget: 15000, currency: 'USD', tasks: [] },
    { id: 3, name: 'Marketing Website', client: 'Innovate Inc.', status: 'In Progress', tracked: 12.0, assignedTo: 1, billing: { type: 'Hourly', rate: 90 }, budget: null, currency: 'EUR', tasks: [] },
    { id: 4, name: 'Data Analytics Dashboard', client: 'Quantum Solutions', status: 'Planning', tracked: 5.2, assignedTo: 3, billing: { type: 'Hourly', rate: 150 }, budget: null, currency: 'USD', tasks: [] },
    { id: 5, name: 'Brand Identity', client: 'Apex Designs', status: 'Completed', tracked: 40.0, assignedTo: 2, billing: { type: 'Fixed Price'}, budget: 5000, currency: 'GBP', tasks: [] },
    { id: 6, name: 'Internal CRM', client: 'Apex Designs', status: 'On Hold', tracked: 0, assignedTo: null, billing: { type: 'Hourly', rate: 100 }, budget: null, currency: 'USD', tasks: [] },
];

const initialTimeEntries = [
    { id: 1, projectId: 1, hours: 2.5, date: '2025-09-18', description: 'Worked on UI mockups for the home screen.', memberId: 2, isBilled: false },
    { id: 2, projectId: 3, hours: 4.0, date: '2025-09-18', description: 'Initial project setup and dependency installation.', memberId: 1, isBilled: false },
    { id: 3, projectId: 1, hours: 3.0, date: '2025-09-17', description: 'Client meeting to discuss feedback on wireframes.', memberId: 2, isBilled: false },
    { id: 4, projectId: 2, hours: 8.0, date: '2025-07-16', description: 'Deployed final version to production.', memberId: 1, isBilled: true },
    { id: 5, projectId: 4, hours: 5.2, date: '2025-08-15', description: 'Initial data modeling.', memberId: 3, isBilled: false },
    { id: 6, projectId: 3, hours: 3.5, date: '2025-09-12', description: 'Set up staging environment.', memberId: 1, isBilled: false },
    { id: 7, projectId: 1, hours: 5.0, date: '2025-09-11', description: 'Component library research.', memberId: 2, isBilled: false },
];

const initialInvoices = [
    { id: 'INV-001', clientName: 'Innovate Inc.', issueDate: '2025-07-17', dueDate: '2025-08-17', amount: 950.00, status: 'Paid', currency: 'USD', items: []},
    { id: 'INV-002', clientName: 'Quantum Solutions', issueDate: '2025-08-20', dueDate: '2025-09-20', amount: 780.00, status: 'Paid', currency: 'USD', items: []},
];

const initialExpenses = [
    { id: 1, projectId: 1, description: 'Stock Photos License', amount: 75.00, date: '2025-09-10', isBilled: false, isBillable: true },
    { id: 2, projectId: 3, description: 'Premium WordPress Plugin', amount: 59.99, date: '2025-09-12', isBilled: false, isBillable: true },
    { id: 3, projectId: 2, description: 'Server Hosting (Q3)', amount: 150.00, date: '2025-07-01', isBilled: true, isBillable: true },
    { id: 4, projectId: 1, description: 'New Keyboard', amount: 120.00, date: '2025-09-15', isBilled: false, isBillable: false },
];

const initialUserProfile = {
    companyName: 'Your Company',
    companyEmail: 'your.email@example.com',
    companyAddress: '123 Freelance St, Work City',
    logo: null,
};

const initialTeamMembers = (currentUser) => [
    { id: 1, name: currentUser.name, email: currentUser.email, role: 'Admin', rate: 75 },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Member', rate: 50 },
    { id: 3, name: 'John Smith', email: 'john.smith@example.com', role: 'Member', rate: 60 },
];

const initialRecurringInvoices = [
    { id: 1, clientName: 'Innovate Inc.', frequency: 'Monthly', nextDueDate: '2025-10-01', amount: 2500, items: [{ description: 'Monthly Marketing Retainer', amount: 2500 }], currency: 'USD' },
    { id: 2, clientName: 'Apex Designs', frequency: 'Quarterly', nextDueDate: '2025-11-15', amount: 750, items: [{ description: 'Quarterly Website Maintenance', amount: 750 }], currency: 'GBP' },
];

const initialTaxSettings = {
    rate: 25,
};

const initialCurrencySettings = {
    default: 'USD',
};


// --- REUSABLE UI COMPONENTS (shadcn/ui inspired) ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-700",
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    />
);

const Select = ({ children, className = '', ...props }) => (
    <select
        className={`w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
        {...props}
    >
        {children}
    </select>
);

const Textarea = ({ className = '', ...props }) => (
    <textarea
        className={`w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        rows="3"
        {...props}
    />
);


const Label = ({ children, htmlFor, className = '' }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}>
        {children}
    </label>
);

const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- VIEW COMPONENTS ---

const TaxEstimator = ({ invoices, taxSettings, currencySettings }) => {
    const getQuarterDetails = (date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        if (month < 3) return { quarter: 1, start: new Date(year, 0, 1), end: new Date(year, 2, 31) };
        if (month < 6) return { quarter: 2, start: new Date(year, 3, 1), end: new Date(year, 5, 30) };
        if (month < 9) return { quarter: 3, start: new Date(year, 6, 1), end: new Date(year, 8, 30) };
        return { quarter: 4, start: new Date(year, 9, 1), end: new Date(year, 11, 31) };
    };

    const today = new Date();
    const { quarter, start, end } = getQuarterDetails(today);

    const quarterlyRevenue = invoices
        .filter(inv => {
            const issueDate = new Date(inv.issueDate);
            return inv.status === 'Paid' && issueDate >= start && issueDate <= end && inv.currency === currencySettings.default;
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

    const estimatedTax = quarterlyRevenue * (taxSettings.rate / 100);

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Quarterly Tax Estimate</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Q{quarter} {today.getFullYear()} (in your default currency: {currencySettings.default})</p>
            <div className="mt-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-gray-600 dark:text-gray-300">Revenue this Quarter:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(quarterlyRevenue, currencySettings.default)}</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Tax Rate:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{taxSettings.rate}%</span>
                </div>
                <div className="border-t dark:border-gray-700 my-3"></div>
                <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-800 dark:text-white">Estimated Tax Owed:</span>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-500">{formatCurrency(estimatedTax, currencySettings.default)}</span>
                </div>
            </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                This is a simple estimate based on paid invoices and is not professional tax advice.
            </p>
        </Card>
    );
};

const DashboardView = ({ projects, clients, timeEntries, invoices, taxSettings, currencySettings }) => {
    const totalProjects = projects.length;
    const totalClients = clients.length;
    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    const totalHoursTracked = projects.reduce((acc, p) => acc + p.tracked, 0);
    const projectMap = projects.reduce((acc, proj) => {
        acc[proj.id] = proj.name;
        return acc;
    }, {});

    const recentActivities = [
        ...timeEntries.slice(0, 3).map(t => ({ type: 'time', data: t, date: t.date })),
        ...invoices.slice(0, 2).map(i => ({ type: 'invoice', data: i, date: i.issueDate }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back! Here's a summary of your activity.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{totalProjects}</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{activeProjects}</p>
                </Card>
                 <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{totalClients}</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Tracked</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{totalHoursTracked.toFixed(1)}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                 <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                    <ul className="divide-y dark:divide-gray-700">
                        {recentActivities.slice(0, 5).map((activity, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                {activity.type === 'time' && (
                                    <>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">Logged {activity.data.hours.toFixed(1)} hours on <span className="font-semibold">{projectMap[activity.data.projectId]}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.data.description}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                                    </>
                                )}
                                 {activity.type === 'invoice' && (
                                    <>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">Invoice <span className="font-semibold">{activity.data.id}</span> created for <span className="font-semibold">{activity.data.clientName}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Amount: {formatCurrency(activity.data.amount, activity.data.currency)}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
                <TaxEstimator invoices={invoices} taxSettings={taxSettings} currencySettings={currencySettings} />
            </div>
        </div>
    );
};

const ClientsView = ({ clients, setClients }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');

    const openAddDialog = () => {
        setEditingClient(null);
        setFormName('');
        setFormEmail('');
        setIsDialogOpen(true);
    };

    const openEditDialog = (client) => {
        setEditingClient(client);
        setFormName(client.name);
        setFormEmail(client.email);
        setIsDialogOpen(true);
    };
    
    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingClient(null);
    };

    const handleSaveClient = (e) => {
        e.preventDefault();
        if (formName.trim() && formEmail.trim()) {
            if (editingClient) {
                // Update existing client
                setClients(clients.map(c => c.id === editingClient.id ? { ...c, name: formName, email: formEmail } : c));
            } else {
                // Add new client
                const newClient = {
                    id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
                    name: formName,
                    email: formEmail,
                    projects: 0
                };
                setClients([newClient, ...clients]);
            }
            closeDialog();
        }
    };
    
    const handleDeleteClient = () => {
        if (clientToDelete) {
            setClients(clients.filter(c => c.id !== clientToDelete.id));
            setClientToDelete(null);
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Clients</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your clients here.</p>
                </div>
                <Button onClick={openAddDialog}>Add New Client</Button>
            </div>
            
            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Projects</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{client.name}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{client.email}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400 text-center">{client.projects}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(client)}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setClientToDelete(client)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title={editingClient ? "Edit Client" : "Add New Client"}>
                <form onSubmit={handleSaveClient} className="space-y-4">
                    <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input id="clientName" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="clientEmail">Client Email</Label>
                        <Input id="clientEmail" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={closeDialog}>Cancel</Button>
                        <Button type="submit">{editingClient ? "Save Changes" : "Add Client"}</Button>
                    </div>
                </form>
            </Dialog>

            <Dialog isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)} title="Delete Client">
                <p>Are you sure you want to delete the client "{clientToDelete?.name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setClientToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteClient}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};

const ProjectDetailView = ({ project, setProjects, teamMembers, onBack }) => {
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [formState, setFormState] = useState({ title: '', description: '', assignedTo: '' });

    const teamMemberMap = useMemo(() => teamMembers.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {}), [teamMembers]);

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, newStatus) => {
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === project.id) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
                };
            }
            return p;
        }));
    };

    const openAddDialog = () => {
        setEditingTask(null);
        setFormState({ title: '', description: '', assignedTo: teamMembers.length > 0 ? teamMembers[0].id : '' });
        setIsTaskDialogOpen(true);
    };

    const openEditDialog = (task) => {
        setEditingTask(task);
        setFormState({ title: task.title, description: task.description, assignedTo: task.assignedTo });
        setIsTaskDialogOpen(true);
    };

    const handleDeleteTask = () => {
        if (taskToDelete) {
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === project.id) {
                    return { ...p, tasks: p.tasks.filter(t => t.id !== taskToDelete.id) };
                }
                return p;
            }));
            setTaskToDelete(null);
        }
    };

    const handleSaveTask = (e) => {
        e.preventDefault();
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === project.id) {
                let newTasks;
                if (editingTask) {
                    // Update existing task
                    newTasks = p.tasks.map(t => t.id === editingTask.id ? { ...t, ...formState, assignedTo: parseInt(formState.assignedTo) } : t);
                } else {
                    // Add new task
                    const newTask = {
                        id: Date.now(),
                        status: 'To Do',
                        ...formState,
                        assignedTo: parseInt(formState.assignedTo),
                    };
                    newTasks = [...p.tasks, newTask];
                }
                return { ...p, tasks: newTasks };
            }
            return p;
        }));
        setIsTaskDialogOpen(false);
    };

    const TaskCard = ({ task }) => (
        <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDoubleClick={() => openEditDialog(task)}
            className="group bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border dark:border-gray-600 cursor-grab"
        >
            <p className="font-medium text-sm text-gray-800 dark:text-gray-100 pr-2">{task.title}</p>
            {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>}
            {task.assignedTo && teamMemberMap[task.assignedTo] && (
                <div className="flex items-center mt-3">
                    <img 
                        src={`https://placehold.co/24x24/E2E8F0/4A5568?text=${teamMemberMap[task.assignedTo].name.charAt(0)}`}
                        alt={teamMemberMap[task.assignedTo].name}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{teamMemberMap[task.assignedTo].name}</span>
                </div>
            )}
        </div>
    );

    const KanbanColumn = ({ title, status, tasks }) => (
        <div 
            className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 flex-1 min-h-[200px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
        >
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">{title} ({tasks.length})</h3>
            <div className="space-y-3">
                {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
        </div>
    );

    return (
        <div>
            <Button variant="secondary" onClick={onBack} className="mb-4">&larr; Back to Projects</Button>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{project.client}</p>
                </div>
                <Button onClick={openAddDialog}>Add New Task</Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
                <KanbanColumn title="To Do" status="To Do" tasks={project.tasks.filter(t => t.status === 'To Do')} />
                <KanbanColumn title="In Progress" status="In Progress" tasks={project.tasks.filter(t => t.status === 'In Progress')} />
                <KanbanColumn title="Done" status="Done" tasks={project.tasks.filter(t => t.status === 'Done')} />
            </div>

            <Dialog isOpen={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} title={editingTask ? "Edit Task" : "Add New Task"}>
                <form onSubmit={handleSaveTask} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" type="text" value={formState.title} onChange={(e) => setFormState(s => ({...s, title: e.target.value}))} required />
                    </div>
                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formState.description} onChange={(e) => setFormState(s => ({...s, description: e.target.value}))} />
                    </div>
                    <div>
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Select id="assignedTo" value={formState.assignedTo} onChange={(e) => setFormState(s => ({...s, assignedTo: e.target.value}))}>
                            {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Select>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                             {editingTask && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    onClick={() => {
                                        setIsTaskDialogOpen(false);
                                        setTaskToDelete(editingTask);
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingTask ? "Save Changes" : "Add Task"}</Button>
                        </div>
                    </div>
                </form>
            </Dialog>

             <Dialog isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} title="Delete Task">
                <p>Are you sure you want to delete this task: "{taskToDelete?.title}"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setTaskToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};


const ProjectsView = ({ projects, setProjects, clients, teamMembers, currencySettings, setViewingProject }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    
    const [formState, setFormState] = useState({
        name: '',
        client: clients.length > 0 ? clients[0].name : '',
        status: 'Planning',
        assignedTo: teamMembers.length > 0 ? teamMembers[0].id : null,
        billingType: 'Hourly',
        billingRate: 100,
        budget: 5000,
        currency: currencySettings.default,
    });
    
    const teamMemberMap = teamMembers.reduce((acc, member) => {
        acc[member.id] = member.name;
        return acc;
    }, {});

    const openAddDialog = () => {
        setEditingProject(null);
        setFormState({
            name: '',
            client: clients.length > 0 ? clients[0].name : '',
            status: 'Planning',
            assignedTo: teamMembers.length > 0 ? teamMembers[0].id : null,
            billingType: 'Hourly',
            billingRate: 100,
            budget: 5000,
            currency: currencySettings.default,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (project) => {
        setEditingProject(project);
        setFormState({
            name: project.name,
            client: project.client,
            status: project.status,
            assignedTo: project.assignedTo,
            billingType: project.billing.type,
            billingRate: project.billing.rate || 100,
            budget: project.budget || 5000,
            currency: project.currency,
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingProject(null);
    };
    
    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({...prev, [id]: value}));
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        if (formState.name.trim() && formState.client) {
            const projectData = {
                name: formState.name,
                client: formState.client,
                status: formState.status,
                assignedTo: formState.assignedTo ? parseInt(formState.assignedTo) : null,
                currency: formState.currency,
                billing: {
                    type: formState.billingType,
                    rate: formState.billingType === 'Hourly' ? parseFloat(formState.billingRate) : undefined,
                },
                budget: formState.billingType === 'Fixed Price' ? parseFloat(formState.budget) : null,
            };

            if (editingProject) {
                setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p));
            } else {
                 const newProject = {
                    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
                    ...projectData,
                    tracked: 0,
                    tasks: [],
                };
                setProjects([newProject, ...projects]);
            }
            closeDialog();
        }
    };
    
    const handleDeleteProject = () => {
        if (projectToDelete) {
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
        }
    };
    
    const statusOptions = ["Planning", "In Progress", "Completed", "On Hold"];
    
    const statusColors = {
        "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "Planning": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        "On Hold": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Projects</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your projects here.</p>
                </div>
                <Button onClick={openAddDialog}>Create New Project</Button>
            </div>
            
            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Assigned To</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Hours Tracked</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {projects.map(project => (
                             <tr key={project.id}>
                                <td className="p-4 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => setViewingProject(project)}>
                                    {project.name}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{project.client}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{teamMemberMap[project.assignedTo] || 'Unassigned'}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{project.tracked.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(project)}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setProjectToDelete(project)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title={editingProject ? "Edit Project" : "Create New Project"}>
                <form onSubmit={handleSaveProject} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" type="text" value={formState.name} onChange={handleFormChange} required />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <Label htmlFor="client">Client</Label>
                           <Select id="client" value={formState.client} onChange={handleFormChange}>
                               {clients.map(client => (
                                   <option key={client.id} value={client.name}>{client.name}</option>
                               ))}
                           </Select>
                       </div>
                       <div>
                           <Label htmlFor="assignedTo">Assigned To</Label>
                           <Select id="assignedTo" value={formState.assignedTo || ''} onChange={handleFormChange}>
                               <option value="">Unassigned</option>
                               {teamMembers.map(member => (
                                   <option key={member.id} value={member.id}>{member.name}</option>
                               ))}
                           </Select>
                       </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="billingType">Billing Method</Label>
                            <Select id="billingType" value={formState.billingType} onChange={handleFormChange}>
                               <option>Hourly</option>
                               <option>Fixed Price</option>
                            </Select>
                         </div>
                         {formState.billingType === 'Hourly' ? (
                             <div>
                                <Label htmlFor="billingRate">Hourly Rate</Label>
                                <div className="relative">
                                     <Input id="billingRate" type="number" value={formState.billingRate} onChange={handleFormChange} className="pl-8"/>
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{CURRENCIES.find(c=>c.code === formState.currency)?.symbol || '$'}</span>
                                </div>
                             </div>
                         ) : (
                             <div>
                                <Label htmlFor="budget">Project Budget</Label>
                                 <div className="relative">
                                    <Input id="budget" type="number" value={formState.budget} onChange={handleFormChange} className="pl-8"/>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{CURRENCIES.find(c=>c.code === formState.currency)?.symbol || '$'}</span>
                                 </div>
                             </div>
                         )}
                     </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select id="currency" value={formState.currency} onChange={handleFormChange}>
                               {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                            </Select>
                         </div>
                         <div>
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" value={formState.status} onChange={handleFormChange}>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={closeDialog}>Cancel</Button>
                        <Button type="submit">{editingProject ? "Save Changes" : "Create Project"}</Button>
                    </div>
                </form>
            </Dialog>

            <Dialog isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Delete Project">
                <p>Are you sure you want to delete the project "{projectToDelete?.name}"? This will not delete its associated time entries but may affect reporting.</p>
                 <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setProjectToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteProject}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};

const TimeTrackingView = ({ projects, setProjects, timeEntries, setTimeEntries, user }) => {
    const [selectedProject, setSelectedProject] = useState(projects.length > 0 ? projects[0].id : '');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerStartTime, setTimerStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerProjectId, setTimerProjectId] = useState(projects.length > 0 ? projects[0].id : null);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - timerStartTime) / 1000));
            }, 1000);
        } else if (!isTimerRunning && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerStartTime]);

    const handleStartTimer = () => {
        if (!timerProjectId) {
            alert("Please select a project to track.");
            return;
        }
        setIsTimerRunning(true);
        setTimerStartTime(Date.now());
        setElapsedTime(0);
    };

    const handleStopTimer = () => {
        setIsTimerRunning(false);
        const finalElapsedTimeInHours = (elapsedTime / 3600).toFixed(2);
        
        setSelectedProject(timerProjectId);
        setHours(finalElapsedTimeInHours);
        setDate(new Date().toISOString().split('T')[0]);
        setDescription(`Real-time tracked entry for ${new Date().toLocaleTimeString()}`);
        
        setTimerStartTime(null);
        setElapsedTime(0);
    };

    const handleAddTimeEntry = (e) => {
        e.preventDefault();
        const hoursNum = parseFloat(hours);
        if (!selectedProject || !hours || isNaN(hoursNum) || hoursNum <= 0) {
            console.error("Invalid input");
            return;
        }
        const newEntry = {
            id: timeEntries.length > 0 ? Math.max(...timeEntries.map(t => t.id)) + 1 : 1,
            projectId: parseInt(selectedProject),
            hours: hoursNum,
            date,
            description,
            memberId: user.id, // Assuming current user's ID
            isBilled: false,
        };
        setTimeEntries([newEntry, ...timeEntries]);
        
        setProjects(projects.map(p => p.id === parseInt(selectedProject) ? { ...p, tracked: p.tracked + hoursNum } : p));
        
        setHours('');
        setDescription('');
    };
    
    const projectMap = projects.reduce((acc, proj) => {
        acc[proj.id] = proj.name;
        return acc;
    }, {});

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    
    const timerProjectName = timerProjectId ? projectMap[timerProjectId] : 'No project selected';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Time Tracking</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Log your work hours or use the real-time tracker.</p>

            <Card className="my-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                         <Label htmlFor="timerProject">Track Project</Label>
                         <Select id="timerProject" value={timerProjectId || ''} onChange={(e) => setTimerProjectId(e.target.value)} disabled={isTimerRunning}>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Select>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{isTimerRunning ? `Tracking: ${timerProjectName}` : 'Timer is stopped'}</p>
                        <p className="text-4xl font-bold font-mono text-gray-800 dark:text-white">{formatTime(elapsedTime)}</p>
                    </div>
                    <div>
                        {isTimerRunning ? (
                            <Button variant="destructive" onClick={handleStopTimer} className="w-32">Stop Timer</Button>
                        ) : (
                            <Button onClick={handleStartTimer} className="w-32">Start Timer</Button>
                        )}
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Log Time Manually</h3>
                        <form onSubmit={handleAddTimeEntry} className="space-y-4">
                             <div>
                                <Label htmlFor="logProject">Project</Label>
                                <Select id="logProject" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="hours">Hours</Label>
                                <Input id="hours" type="number" step="0.01" value={hours} onChange={e => setHours(e.target.value)} required />
                            </div>
                             <div>
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                             <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full">Log Time</Button>
                        </form>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                     <Card className="overflow-x-auto">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Entries</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Hours</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {timeEntries.slice(0, 5).map(entry => (
                                    <tr key={entry.id}>
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{projectMap[entry.projectId]}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">{entry.hours.toFixed(2)}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{entry.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InvoiceDetailView = ({ invoice, client, onBack, onStatusChange, onDownloadPdf, pdfLibrariesLoaded, userProfile }) => {
    const statusColors = {
        "Paid": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "Draft": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        "Overdue": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <Button variant="secondary" onClick={onBack}>&larr; Back to Invoices</Button>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">Invoice {invoice.id}</h1>
                    <span className={`mt-1 px-2 py-1 text-sm font-semibold rounded-full ${statusColors[invoice.status]}`}>
                        {invoice.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    {invoice.status === 'Draft' && (
                        <Button onClick={() => onStatusChange(invoice.id, 'Paid')}>Mark as Paid</Button>
                    )}
                    <Button variant="secondary" onClick={onDownloadPdf} disabled={!pdfLibrariesLoaded}>
                        {pdfLibrariesLoaded ? 'Download PDF' : 'Loading PDF...'}
                    </Button>
                </div>
            </div>

            <Card id="invoice-content">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        {userProfile.logo ? (
                            <img src={userProfile.logo} alt="Company Logo" className="h-12 max-w-[200px] object-contain mb-4" />
                        ) : (
                            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-500">{userProfile.companyName}</h2>
                        )}
                        <p className="text-gray-500 dark:text-gray-400">{userProfile.companyEmail}</p>
                        <p className="text-gray-500 dark:text-gray-400">{userProfile.companyAddress}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bill To:</h3>
                        <p className="font-bold">{client?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{client?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-8">
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</h3>
                        <p className="font-medium text-gray-800 dark:text-white">{invoice.id}</p>
                    </div>
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Issue Date</h3>
                        <p className="font-medium text-gray-800 dark:text-white">{invoice.issueDate}</p>
                    </div>
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Due Date</h3>
                        <p className="font-medium text-gray-800 dark:text-white">{invoice.dueDate}</p>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr className="border-b dark:border-gray-600">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Hours/Qty</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Rate/Price</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {(invoice.items || []).map((item, index) => (
                                <tr key={index}>
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{item.description}</td>
                                    {item.hours ? ( // Time Entry
                                        <>
                                            <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">{item.hours.toFixed(2)}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">{formatCurrency(item.rate, invoice.currency)}</td>
                                            <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{formatCurrency(item.hours * item.rate, invoice.currency)}</td>
                                        </>
                                    ) : ( // Expense
                                        <>
                                            <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">1</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">{formatCurrency(item.amount, invoice.currency)}</td>
                                            <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{formatCurrency(item.amount, invoice.currency)}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-200 dark:border-gray-600">
                             <tr>
                                <td colSpan="3" className="p-4 text-right font-semibold text-gray-800 dark:text-white">Total</td>
                                <td className="p-4 text-right font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(invoice.amount, invoice.currency)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const InvoicesView = ({ projects, clients, timeEntries, setTimeEntries, invoices, setInvoices, expenses, setExpenses, pdfLibrariesLoaded, userProfile, recurringInvoices, setRecurringInvoices }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(clients.length > 0 ? clients[0].id : '');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [activeTab, setActiveTab] = useState('one-time');

    const handleGenerateInvoice = () => {
        if (!selectedClient) return;

        const clientObj = clients.find(c => c.id === parseInt(selectedClient));
        if (!clientObj) return;

        const clientProjects = projects.filter(p => p.client === clientObj.name && p.currency === selectedCurrency);
        const clientProjectIds = clientProjects.map(p => p.id);

        const unbilledEntries = timeEntries.filter(entry => 
            clientProjectIds.includes(entry.projectId) && !entry.isBilled
        );
        
        const unbilledExpenses = expenses.filter(expense =>
            clientProjectIds.includes(expense.projectId) && !expense.isBilled
        );

        if (unbilledEntries.length === 0 && unbilledExpenses.length === 0) {
            alert(`No unbilled hours or expenses in ${selectedCurrency} found for ${clientObj.name}.`);
            return;
        }

        const projectMap = projects.reduce((acc, proj) => {
            acc[proj.id] = proj;
            return acc;
        }, {});

        const timeInvoiceItems = unbilledEntries.map(entry => {
            const project = projectMap[entry.projectId];
            const rate = project?.billing?.type === 'Hourly' ? project.billing.rate : 100; // default rate
            return {
                id: `time-${entry.id}`,
                description: `${project?.name || 'Project'} - ${entry.description || 'Work done'} on ${entry.date}`,
                hours: entry.hours,
                rate: rate
            }
        });

        const expenseInvoiceItems = unbilledExpenses.map(expense => ({
            id: `exp-${expense.id}`,
            description: `Expense: ${expense.description} on ${expense.date}`,
            amount: expense.amount,
        }));
        
        const timeAmount = timeInvoiceItems.reduce((sum, item) => sum + (item.hours * item.rate), 0);
        const expensesAmount = unbilledExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalAmount = timeAmount + expensesAmount;

        const newInvoice = {
            id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
            clientName: clientObj.name,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: totalAmount,
            status: 'Draft',
            currency: selectedCurrency,
            items: [...timeInvoiceItems, ...expenseInvoiceItems],
        };

        setInvoices([newInvoice, ...invoices]);
        
        const billedEntryIds = unbilledEntries.map(entry => entry.id);
        const updatedTimeEntries = timeEntries.map(entry => 
            billedEntryIds.includes(entry.id) ? { ...entry, isBilled: true } : entry
        );
        setTimeEntries(updatedTimeEntries);
        
        const billedExpenseIds = unbilledExpenses.map(exp => exp.id);
        const updatedExpenses = expenses.map(exp => 
            billedExpenseIds.includes(exp.id) ? { ...exp, isBilled: true } : exp
        );
        setExpenses(updatedExpenses);

        setIsDialogOpen(false);
    };

    const handleStatusChange = (invoiceId, newStatus) => {
        setInvoices(invoices.map(inv => inv.id === invoiceId ? {...inv, status: newStatus} : inv));
        setViewingInvoice(prev => prev ? {...prev, status: newStatus} : null);
    };

    const handleDownloadPdf = () => {
        const invoiceContent = document.getElementById('invoice-content');
        if (invoiceContent && window.html2canvas && window.jspdf) {
            const { jsPDF } = window.jspdf;
            window.html2canvas(invoiceContent, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`invoice-${viewingInvoice.id}.pdf`);
            });
        } else {
            console.error("PDF generation libraries not loaded.");
        }
    };
    
    const statusColors = {
        "Paid": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "Draft": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        "Overdue": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    if (viewingInvoice) {
        const clientDetails = clients.find(c => c.name === viewingInvoice.clientName);
        return (
            <InvoiceDetailView 
                invoice={viewingInvoice} 
                client={clientDetails}
                onBack={() => setViewingInvoice(null)}
                onStatusChange={handleStatusChange}
                onDownloadPdf={handleDownloadPdf}
                pdfLibrariesLoaded={pdfLibrariesLoaded}
                userProfile={userProfile}
            />
        );
    }

    return (
        <div>
             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Invoices</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Create and manage your client invoices.</p>
                </div>
            </div>

            <div className="border-b dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('one-time')}
                        className={`${
                            activeTab === 'one-time'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        One-Time Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('recurring')}
                        className={`${
                            activeTab === 'recurring'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        Recurring Invoices
                    </button>
                </nav>
            </div>
            
            {activeTab === 'one-time' && (
                <>
                <div className="text-right mb-4">
                    <Button onClick={() => setIsDialogOpen(true)}>Create New Invoice</Button>
                </div>
                <Card className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Invoice ID</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Issue Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => setViewingInvoice(invoice)}>
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-100 font-mono">{invoice.id}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{invoice.clientName}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{invoice.issueDate}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{formatCurrency(invoice.amount, invoice.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                </>
            )}

            {activeTab === 'recurring' && (
                <RecurringInvoicesView clients={clients} recurringInvoices={recurringInvoices} setRecurringInvoices={setRecurringInvoices} />
            )}

            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Create New Invoice">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="invoiceClient">Select Client</Label>
                            <Select id="invoiceClient" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                                 {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="invoiceCurrency">Currency</Label>
                             <Select id="invoiceCurrency" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </Select>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This will generate an invoice for all unbilled hours and expenses in the selected currency for this client.</p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
                </div>
            </Dialog>
        </div>
    );
};

const RecurringInvoicesView = ({ clients, recurringInvoices, setRecurringInvoices }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRecurring, setEditingRecurring] = useState(null);
    const [recurringToDelete, setRecurringToDelete] = useState(null);

    const defaultFormState = {
        clientName: clients.length > 0 ? clients[0].name : '',
        frequency: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        lineItems: [{ description: '', amount: '' }],
        currency: 'USD',
    };
    
    const [formState, setFormState] = useState(defaultFormState);

    const handleAddItem = () => setFormState(prev => ({...prev, lineItems: [...prev.lineItems, {description: '', amount: ''}]}));
    const handleRemoveItem = (index) => setFormState(prev => ({...prev, lineItems: prev.lineItems.filter((_, i) => i !== index)}));
    const handleItemChange = (index, field, value) => {
        const newItems = [...formState.lineItems];
        newItems[index][field] = value;
        setFormState(prev => ({...prev, lineItems: newItems}));
    };
    
    const handleFormStateChange = (e) => {
        setFormState(prev => ({...prev, [e.target.id]: e.target.value }));
    };
    
    const openAddDialog = () => {
        setEditingRecurring(null);
        setFormState(defaultFormState);
        setIsDialogOpen(true);
    };

    const openEditDialog = (rec) => {
        setEditingRecurring(rec);
        setFormState({
            clientName: rec.clientName,
            frequency: rec.frequency,
            startDate: rec.nextDueDate,
            lineItems: rec.items,
            currency: rec.currency,
        });
        setIsDialogOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const totalAmount = formState.lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        
        if (editingRecurring) {
            const updatedRecurring = {
                ...editingRecurring,
                clientName: formState.clientName,
                frequency: formState.frequency,
                nextDueDate: formState.startDate,
                amount: totalAmount,
                currency: formState.currency,
                items: formState.lineItems.map(item => ({...item, amount: parseFloat(item.amount) || 0 }))
            };
            setRecurringInvoices(recurringInvoices.map(r => r.id === editingRecurring.id ? updatedRecurring : r));

        } else {
            const newRecurring = {
                id: recurringInvoices.length > 0 ? Math.max(...recurringInvoices.map(i => i.id)) + 1 : 1,
                clientName: formState.clientName,
                frequency: formState.frequency,
                nextDueDate: formState.startDate,
                amount: totalAmount,
                currency: formState.currency,
                items: formState.lineItems.map(item => ({...item, amount: parseFloat(item.amount) || 0 }))
            };
            setRecurringInvoices([newRecurring, ...recurringInvoices]);
        }
        
        setIsDialogOpen(false);
    };
    
    const handleDelete = () => {
        if (recurringToDelete) {
            setRecurringInvoices(recurringInvoices.filter(r => r.id !== recurringToDelete.id));
            setRecurringToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recurring Profiles</h2>
                 <Button onClick={openAddDialog}>Create Profile</Button>
            </div>
             <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Frequency</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Next Due Date</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                             <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {recurringInvoices.map(rec => (
                            <tr key={rec.id}>
                                <td className="p-4 font-medium">{rec.clientName}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{rec.frequency}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{rec.nextDueDate}</td>
                                <td className="p-4 text-right font-mono">{formatCurrency(rec.amount, rec.currency)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(rec)}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setRecurringToDelete(rec)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
             <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingRecurring ? "Edit Recurring Profile" : "Create Recurring Profile"}>
                <form onSubmit={handleSave} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label htmlFor="clientName">Client</Label>
                           <Select id="clientName" value={formState.clientName} onChange={handleFormStateChange}>
                               {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                           </Select>
                       </div>
                       <div>
                           <Label htmlFor="currency">Currency</Label>
                           <Select id="currency" value={formState.currency} onChange={handleFormStateChange}>
                               {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                           </Select>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select id="frequency" value={formState.frequency} onChange={handleFormStateChange}>
                                <option>Monthly</option>
                                <option>Quarterly</option>
                                <option>Annually</option>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" value={formState.startDate} onChange={handleFormStateChange} />
                        </div>
                    </div>
                    <div>
                        <Label>Line Items</Label>
                        <div className="space-y-2">
                        {formState.lineItems.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="flex-grow"/>
                                <div className="relative">
                                    <Input type="number" placeholder="Amount" value={item.amount} onChange={e => handleItemChange(index, 'amount', e.target.value)} className="w-28 pl-7"/>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{CURRENCIES.find(c => c.code === formState.currency)?.symbol || '$'}</span>
                                </div>
                                <Button type="button" variant="ghost" onClick={() => handleRemoveItem(index)} className="text-red-500"><TrashIcon className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="secondary" onClick={handleAddItem} className="mt-2 text-sm">Add Item</Button>
                    </div>
                     <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Profile</Button>
                    </div>
                </form>
            </Dialog>
            <Dialog isOpen={!!recurringToDelete} onClose={() => setRecurringToDelete(null)} title="Delete Recurring Profile">
                 <p>Are you sure you want to delete this recurring profile for {recurringToDelete?.clientName}?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setRecurringToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};


const ReportingView = ({ projects, clients, timeEntries, teamMembers, expenses }) => {
    const [filter, setFilter] = useState('all'); // 'week', 'month', 'all'

    const getFilteredEntries = React.useCallback(() => {
        const now = new Date();
        if (filter === 'all') return timeEntries;
        if (filter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return timeEntries.filter(entry => new Date(entry.date) >= startOfMonth);
        }
        if (filter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return timeEntries.filter(entry => new Date(entry.date) >= startOfWeek);
        }
        return [];
    }, [timeEntries, filter]);

    const filteredEntries = getFilteredEntries();

    const projectMap = projects.reduce((acc, proj) => {
        acc[proj.id] = { name: proj.name, client: proj.client, billing: proj.billing, currency: proj.currency };
        return acc;
    }, {});
    
    // Time Analysis Calculations
    const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableAmountsByCurrency = filteredEntries.reduce((acc, entry) => {
        const project = projectMap[entry.projectId];
        if (project && project.billing.type === 'Hourly') {
            const rate = project.billing.rate || 0;
            const currency = project.currency || 'USD';
            acc[currency] = (acc[currency] || 0) + (entry.hours * rate);
        }
        return acc;
    }, {});
    const projectsWorkedOn = [...new Set(filteredEntries.map(entry => entry.projectId))].length;
    
    const hoursByProject = filteredEntries.reduce((acc, entry) => {
        const projectName = projectMap[entry.projectId]?.name || 'Unknown Project';
        acc[projectName] = (acc[projectName] || 0) + entry.hours;
        return acc;
    }, {});
    
    const hoursByClient = filteredEntries.reduce((acc, entry) => {
        const clientName = projectMap[entry.projectId]?.client || 'Unknown Client';
        acc[clientName] = (acc[clientName] || 0) + entry.hours;
        return acc;
    }, {});

    // Profitability Analysis Calculation (always 'All Time')
    const profitabilityData = React.useMemo(() => {
        const memberRateMap = teamMembers.reduce((acc, member) => {
            acc[member.id] = member.rate;
            return acc;
        }, {});

        return projects.map(project => {
            const projectTimeEntries = timeEntries.filter(t => t.projectId === project.id);
            const totalHours = projectTimeEntries.reduce((sum, t) => sum + t.hours, 0);
            
            let revenue = 0;
            if (project.billing.type === 'Hourly') {
                revenue = totalHours * (project.billing.rate || 0);
            } else { // Fixed Price
                revenue = project.budget || 0;
            }

            const laborCost = projectTimeEntries.reduce((sum, t) => {
                const rate = memberRateMap[t.memberId] || 0;
                return sum + (t.hours * rate);
            }, 0);

            const expensesCost = expenses
                .filter(e => e.projectId === project.id)
                .reduce((sum, e) => sum + e.amount, 0);

            const totalCost = laborCost + expensesCost;

            const profit = revenue - totalCost;
            const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

            return { id: project.id, name: project.name, currency: project.currency, revenue, cost: totalCost, profit, margin };
        });
    }, [projects, timeEntries, teamMembers, expenses]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Analyze your tracked time and earnings.</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Button variant={filter === 'week' ? 'primary' : 'ghost'} onClick={() => setFilter('week')}>This Week</Button>
                    <Button variant={filter === 'month' ? 'primary' : 'ghost'} onClick={() => setFilter('month')}>This Month</Button>
                    <Button variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')}>All Time</Button>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Time Analysis ({filter.charAt(0).toUpperCase() + filter.slice(1)})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{totalHours.toFixed(2)}</p>
                </Card>
                 <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Billable Amount</h3>
                    <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {Object.keys(billableAmountsByCurrency).length > 0 ? (
                           Object.entries(billableAmountsByCurrency).map(([currency, amount]) => (
                               <div key={currency}>{formatCurrency(amount, currency)}</div>
                           ))
                        ) : (
                            <div>{formatCurrency(0, 'USD')}</div>
                        )}
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects Worked On</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{projectsWorkedOn}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hours by Project</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Total Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {Object.entries(hoursByProject).map(([name, hours]) => (
                                    <tr key={name}>
                                        <td className="p-4 font-medium">{name}</td>
                                        <td className="p-4 text-right font-mono">{hours.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hours by Client</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Total Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {Object.entries(hoursByClient).map(([name, hours]) => (
                                    <tr key={name}>
                                        <td className="p-4 font-medium">{name}</td>
                                        <td className="p-4 text-right font-mono">{hours.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <div className="mt-8">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Project Profitability (All Time)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Revenue</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Cost</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Profit</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Margin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {profitabilityData.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-right font-mono">{formatCurrency(item.revenue, item.currency)}</td>
                                        <td className="p-4 text-right font-mono text-red-500">({formatCurrency(item.cost, 'USD')})</td>
                                        <td className={`p-4 text-right font-mono font-semibold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(item.profit, item.currency)}
                                        </td>
                                        <td className={`p-4 text-right font-mono font-semibold ${item.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.margin.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Note: Costs are estimated in your default currency (USD). Profit calculation assumes a 1:1 exchange rate if project currency differs.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ExpensesView = ({ projects, setExpenses, expenses }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const [formProjectId, setFormProjectId] = useState(projects.length > 0 ? projects[0].id : '');
    const [formAmount, setFormAmount] = useState('');
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formDescription, setFormDescription] = useState('');
    const [formIsBillable, setFormIsBillable] = useState(true);

    const projectMap = projects.reduce((acc, proj) => {
        acc[proj.id] = {name: proj.name, currency: proj.currency };
        return acc;
    }, {});
    
    const openAddDialog = () => {
        setEditingExpense(null);
        setFormProjectId(projects.length > 0 ? projects[0].id : '');
        setFormAmount('');
        setFormDate(new Date().toISOString().split('T')[0]);
        setFormDescription('');
        setFormIsBillable(true);
        setIsDialogOpen(true);
    };

    const openEditDialog = (expense) => {
        setEditingExpense(expense);
        setFormProjectId(expense.projectId);
        setFormAmount(expense.amount);
        setFormDate(expense.date);
        setFormDescription(expense.description);
        setFormIsBillable(expense.isBillable);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingExpense(null);
    };

    const handleSaveExpense = (e) => {
        e.preventDefault();
        const amountNum = parseFloat(formAmount);
        if (formDescription.trim() && formProjectId && !isNaN(amountNum) && amountNum > 0) {
            if (editingExpense) {
                setExpenses(expenses.map(ex => ex.id === editingExpense.id ? { ...ex, projectId: parseInt(formProjectId), amount: amountNum, date: formDate, description: formDescription, isBillable: formIsBillable } : ex));
            } else {
                const newExpense = {
                    id: expenses.length > 0 ? Math.max(...expenses.map(ex => ex.id)) + 1 : 1,
                    projectId: parseInt(formProjectId),
                    amount: amountNum,
                    date: formDate,
                    description: formDescription,
                    isBilled: false,
                    isBillable: formIsBillable,
                };
                setExpenses([newExpense, ...expenses]);
            }
            closeDialog();
        }
    };

    const handleDeleteExpense = () => {
        if (expenseToDelete) {
            setExpenses(expenses.filter(ex => ex.id !== expenseToDelete.id));
            setExpenseToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expenses</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Track your project-related expenses.</p>
                </div>
                <Button onClick={openAddDialog}>Add New Expense</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{projectMap[expense.projectId]?.name || 'N/A'}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{expense.description}</td>
                                 <td className="p-4 text-gray-600 dark:text-gray-400">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        expense.isBillable 
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                        {expense.isBillable ? 'Billable' : 'Internal Cost'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{expense.date}</td>
                                <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">
                                    {formatCurrency(expense.amount, projectMap[expense.projectId]?.currency || 'USD')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(expense)}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setExpenseToDelete(expense)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title={editingExpense ? "Edit Expense" : "Add New Expense"}>
                <form onSubmit={handleSaveExpense} className="space-y-4">
                    <div>
                        <Label htmlFor="expenseProject">Project</Label>
                        <Select id="expenseProject" value={formProjectId} onChange={(e) => setFormProjectId(e.target.value)}>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.currency})</option>)}
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="expenseDescription">Description</Label>
                        <Input id="expenseDescription" type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label htmlFor="expenseAmount">Amount</Label>
                           <Input id="expenseAmount" type="number" step="0.01" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required />
                        </div>
                        <div>
                           <Label htmlFor="expenseDate">Date</Label>
                           <Input id="expenseDate" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />
                        </div>
                    </div>
                     <div className="flex items-center mt-4">
                        <input
                            id="isBillable"
                            type="checkbox"
                            checked={formIsBillable}
                            onChange={(e) => setFormIsBillable(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="isBillable" className="ml-2 mb-0">This expense is billable to the client</Label>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={closeDialog}>Cancel</Button>
                        <Button type="submit">{editingExpense ? "Save Changes" : "Add Expense"}</Button>
                    </div>
                </form>
            </Dialog>

             <Dialog isOpen={!!expenseToDelete} onClose={() => setExpenseToDelete(null)} title="Delete Expense">
                <p>Are you sure you want to delete this expense: "{expenseToDelete?.description}"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setExpenseToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteExpense}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};

const SettingsView = ({ user, onLogout, userProfile, setUserProfile, taxSettings, setTaxSettings, currencySettings, setCurrencySettings }) => {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [companyForm, setCompanyForm] = useState(userProfile);
    const [currentTaxRate, setCurrentTaxRate] = useState(taxSettings.rate);
    const [currentDefaultCurrency, setCurrentDefaultCurrency] = useState(currencySettings.default);

    const handleCompanyInfoChange = (e) => {
        const { id, value } = e.target;
        setCompanyForm(prev => ({ ...prev, [id]: value }));
    };
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyForm(prev => ({...prev, logo: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveCompanyInfo = (e) => {
        e.preventDefault();
        setUserProfile(companyForm);
        setIsEditingCompany(false);
    };
    
    const handleTaxRateChange = (e) => {
        setCurrentTaxRate(e.target.value);
    };

    const handleSaveTaxSettings = (e) => {
        e.preventDefault();
        const rate = parseFloat(currentTaxRate);
        if (!isNaN(rate) && rate >= 0 && rate <= 100) {
            setTaxSettings({ rate });
            alert("Tax settings saved.");
        } else {
           alert("Please enter a valid tax rate between 0 and 100.");
        }
    };
    
    const handleSaveCurrencySettings = (e) => {
        e.preventDefault();
        setCurrencySettings({ default: currentDefaultCurrency });
        alert("Currency settings saved.");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your account and preferences.</p>

            <div className="mt-8 space-y-8">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="userName">Name</Label>
                            <Input id="userName" type="text" value={user.name} disabled />
                        </div>
                        <div>
                            <Label htmlFor="userEmail">Email</Label>
                            <Input id="userEmail" type="email" value={user.email} disabled />
                        </div>
                         <Button variant="secondary">Edit Profile</Button>
                    </div>
                </Card>
                
                <Card>
                    <form onSubmit={handleSaveCompanyInfo}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Company Information</h3>
                            {!isEditingCompany && (
                                <Button type="button" variant="secondary" onClick={() => setIsEditingCompany(true)}>Edit</Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" type="text" value={companyForm.companyName} onChange={handleCompanyInfoChange} disabled={!isEditingCompany} />
                            </div>
                            <div>
                                <Label htmlFor="companyEmail">Company Email</Label>
                                <Input id="companyEmail" type="email" value={companyForm.companyEmail} onChange={handleCompanyInfoChange} disabled={!isEditingCompany} />
                            </div>
                             <div>
                                <Label htmlFor="companyAddress">Company Address</Label>
                                <Textarea id="companyAddress" value={companyForm.companyAddress} onChange={handleCompanyInfoChange} disabled={!isEditingCompany} />
                            </div>
                             <div>
                                <Label htmlFor="logo">Company Logo</Label>
                                <div className="flex items-center gap-4">
                                    {companyForm.logo && (
                                        <img src={companyForm.logo} alt="Logo Preview" className="h-16 w-16 object-contain rounded-md bg-gray-100 dark:bg-gray-700 p-1" />
                                    )}
                                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} disabled={!isEditingCompany} className="flex-1" />
                                </div>
                            </div>
                             {isEditingCompany && (
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button type="button" variant="secondary" onClick={() => { setIsEditingCompany(false); setCompanyForm(userProfile); }}>Cancel</Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            )}
                        </div>
                    </form>
                </Card>
                
                 <Card>
                    <form onSubmit={handleSaveCurrencySettings}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Financial Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="defaultCurrency">Default Currency</Label>
                                <Select id="defaultCurrency" value={currentDefaultCurrency} onChange={e => setCurrentDefaultCurrency(e.target.value)}>
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                </Select>
                            </div>
                             <div className="text-right">
                                <Button type="submit">Save Currency</Button>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={handleSaveTaxSettings} className="mt-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="taxRate">Estimated Tax Rate (%)</Label>
                                <Input id="taxRate" type="number" value={currentTaxRate} onChange={handleTaxRateChange} />
                            </div>
                            <div className="text-right">
                                <Button type="submit">Save Tax Rate</Button>
                            </div>
                        </div>
                    </form>
                </Card>


                 <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subscription</h3>
                    <div className="flex justify-between items-center">
                        <div>
                           <p className="font-medium">Current Plan: <span className="text-blue-600 dark:text-blue-500">Pro</span></p>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Your subscription is active.</p>
                        </div>
                        <Button>Manage Subscription</Button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Actions</h3>
                     <Button variant="destructive" onClick={onLogout}>
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Log Out
                    </Button>
                </Card>
            </div>
        </div>
    );
};

const TeamView = ({ teamMembers, setTeamMembers, projects, setProjects }) => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);
    
    const [formState, setFormState] = useState({email: '', rate: 50});

    const handleInvite = (e) => {
        e.preventDefault();
        if (formState.email) {
            const newMember = {
                id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
                name: 'Pending Invitation',
                email: formState.email,
                role: 'Member',
                rate: parseFloat(formState.rate),
            };
            setTeamMembers([...teamMembers, newMember]);
            setIsInviteOpen(false);
            setFormState({email: '', rate: 50});
        }
    };
    
    const handleUpdateRate = (e) => {
        e.preventDefault();
        if (editingMember) {
            setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? {...m, rate: parseFloat(formState.rate)} : m));
            setEditingMember(null);
        }
    };
    
    const handleDeleteMember = () => {
        if (memberToDelete) {
            setTeamMembers(teamMembers.filter(m => m.id !== memberToDelete.id));
            setProjects(projects.map(p => 
                p.assignedTo === memberToDelete.id ? { ...p, assignedTo: null } : p
            ));
            setMemberToDelete(null);
        }
    };
    
    const openEditDialog = (member) => {
        setEditingMember(member);
        setFormState({email: member.email, rate: member.rate});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Team Management</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Invite and manage your team members.</p>
                </div>
                <Button onClick={() => setIsInviteOpen(true)}>Invite Member</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Internal Rate ($/hr)</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {teamMembers.map(member => (
                            <tr key={member.id}>
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-100 flex items-center gap-3">
                                    <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${member.name.charAt(0)}`} alt="Avatar" className="w-8 h-8 rounded-full" />
                                    {member.name}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{member.email}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{member.role}</td>
                                <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{formatCurrency(member.rate, 'USD')}</td>
                                <td className="p-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(member)} disabled={member.role === 'Admin'}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setMemberToDelete(member)} disabled={member.role === 'Admin'}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite New Team Member">
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input id="inviteEmail" type="email" value={formState.email} onChange={(e) => setFormState(p => ({...p, email: e.target.value}))} required placeholder="teammate@example.com" />
                    </div>
                     <div>
                        <Label htmlFor="inviteRate">Internal Hourly Rate ($)</Label>
                        <Input id="inviteRate" type="number" value={formState.rate} onChange={(e) => setFormState(p => ({...p, rate: e.target.value}))} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                        <Button type="submit">Send Invitation</Button>
                    </div>
                </form>
            </Dialog>
            
             <Dialog isOpen={!!editingMember} onClose={() => setEditingMember(null)} title={`Update Rate for ${editingMember?.name}`}>
                <form onSubmit={handleUpdateRate} className="space-y-4">
                    <div>
                        <Label htmlFor="editRate">Internal Hourly Rate ($)</Label>
                        <Input id="editRate" type="number" value={formState.rate} onChange={(e) => setFormState(p => ({...p, rate: e.target.value}))} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setEditingMember(null)}>Cancel</Button>
                        <Button type="submit">Update Rate</Button>
                    </div>
                </form>
            </Dialog>
            
            <Dialog isOpen={!!memberToDelete} onClose={() => setMemberToDelete(null)} title="Delete Team Member">
                <p>Are you sure you want to delete {memberToDelete?.name}? They will be unassigned from all projects.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setMemberToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteMember}>Delete Member</Button>
                </div>
            </Dialog>
        </div>
    );
};


const AuthView = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('user@email.com');
    const [password, setPassword] = useState('password123');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would make an API call here.
        // For this demo, we'll just simulate a successful login/signup.
        if (isLoginView) {
            if (email && password) {
                onLogin({id: 1, name: 'Demo User', email });
            }
        } else {
             if (email && password && name) {
                onLogin({id: 1, name, email });
            }
        }
    };

    const handleGoogleSignIn = () => {
        // In a real app, this would trigger the Google OAuth flow.
        // For this demo, we'll simulate a successful sign-in.
        onLogin({ id: 1, name: 'Google User', email: 'google.user@example.com' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Your all-in-one freelance toolkit.</p>
                </div>
                <Card>
                    <div className="flex border-b dark:border-gray-700 mb-6">
                        <button 
                            className={`flex-1 py-3 text-center font-semibold transition-colors ${isLoginView ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            onClick={() => setIsLoginView(true)}
                        >
                            Log In
                        </button>
                        <button 
                            className={`flex-1 py-3 text-center font-semibold transition-colors ${!isLoginView ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            onClick={() => setIsLoginView(false)}
                        >
                            Sign Up
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginView && (
                             <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <Button type="submit" className="w-full !mt-6">
                            {isLoginView ? 'Log In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t dark:border-gray-600"></div>
                        <span className="mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t dark:border-gray-600"></div>
                    </div>

                    <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn}>
                        <GoogleIcon className="w-5 h-5 mr-3" />
                        Sign in with Google
                    </Button>

                </Card>
                 <p className="text-center text-sm text-gray-500 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const MainAppView = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [viewingProject, setViewingProject] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clients, setClients] = useState(initialClients);
    const [projects, setProjects] = useState(initialProjects);
    const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
    const [invoices, setInvoices] = useState(initialInvoices);
    const [expenses, setExpenses] = useState(initialExpenses);
    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [teamMembers, setTeamMembers] = useState([]);
    const [recurringInvoices, setRecurringInvoices] = useState(initialRecurringInvoices);
    const [taxSettings, setTaxSettings] = useState(initialTaxSettings);
    const [currencySettings, setCurrencySettings] = useState(initialCurrencySettings);
    const [pdfLibrariesLoaded, setPdfLibrariesLoaded] = useState(false);
    
    useEffect(() => {
        // Initialize team members with the current user as Admin
        setTeamMembers(initialTeamMembers(user));
    }, [user]);

    useEffect(() => {
        if (viewingProject) {
            const updatedProject = projects.find(p => p.id === viewingProject.id);
            if (updatedProject) {
                setViewingProject(updatedProject);
            } else {
                setViewingProject(null);
                setActiveView('projects');
            }
        }
    }, [projects]);


    useEffect(() => {
        let scriptsLoaded = 0;
        const totalScripts = 2;

        const onScriptLoad = () => {
            scriptsLoaded++;
            if (scriptsLoaded === totalScripts) {
                setPdfLibrariesLoaded(true);
            }
        };

        // Load PDF generation scripts
        const jspdfScript = document.createElement('script');
        jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        jspdfScript.async = true;
        jspdfScript.onload = onScriptLoad;
        document.body.appendChild(jspdfScript);

        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.async = true;
        html2canvasScript.onload = onScriptLoad;
        document.body.appendChild(html2canvasScript);

        return () => {
            if (document.body.contains(jspdfScript)) {
                document.body.removeChild(jspdfScript);
            }
            if (document.body.contains(html2canvasScript)) {
                document.body.removeChild(html2canvasScript);
            }
        }
    }, []);

     useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    const handleSetViewingProject = (project) => {
        setActiveView('project-detail');
        setViewingProject(project);
    };
    
    const handleBackToProjects = () => {
        setActiveView('projects');
        setViewingProject(null);
    };

    const NavLink = ({ view, icon, children }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setActiveView(view);
                setViewingProject(null);
                setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                activeView === view
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
            <span className="font-medium">{children}</span>
        </a>
    );
    
    const renderView = () => {
        if (activeView === 'project-detail' && viewingProject) {
            return <ProjectDetailView project={viewingProject} setProjects={setProjects} teamMembers={teamMembers} onBack={handleBackToProjects} />;
        }
        
        switch (activeView) {
            case 'dashboard': return <DashboardView projects={projects} clients={clients} timeEntries={timeEntries} invoices={invoices} taxSettings={taxSettings} currencySettings={currencySettings} />;
            case 'projects': return <ProjectsView projects={projects} setProjects={setProjects} clients={clients} teamMembers={teamMembers} currencySettings={currencySettings} setViewingProject={handleSetViewingProject} />;
            case 'clients': return <ClientsView clients={clients} setClients={setClients} />;
            case 'invoices': return <InvoicesView projects={projects} clients={clients} timeEntries={timeEntries} setTimeEntries={setTimeEntries} invoices={invoices} setInvoices={setInvoices} expenses={expenses} setExpenses={setExpenses} pdfLibrariesLoaded={pdfLibrariesLoaded} userProfile={userProfile} recurringInvoices={recurringInvoices} setRecurringInvoices={setRecurringInvoices} />;
            case 'timetracking': return <TimeTrackingView projects={projects} setProjects={setProjects} timeEntries={timeEntries} setTimeEntries={setTimeEntries} user={user} />;
            case 'reporting': return <ReportingView projects={projects} clients={clients} timeEntries={timeEntries} teamMembers={teamMembers} expenses={expenses} />;
            case 'expenses': return <ExpensesView projects={projects} setExpenses={setExpenses} expenses={expenses} />;
            case 'team': return <TeamView teamMembers={teamMembers} setTeamMembers={setTeamMembers} projects={projects} setProjects={setProjects} />;
            case 'settings': return <SettingsView user={user} onLogout={onLogout} userProfile={userProfile} setUserProfile={setUserProfile} taxSettings={taxSettings} setTaxSettings={setTaxSettings} currencySettings={currencySettings} setCurrencySettings={setCurrencySettings} />;
            default: return <DashboardView projects={projects} clients={clients} />;
        }
    };
    
    const sidebarContent = (
         <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink view="dashboard" icon={<HomeIcon />}>Dashboard</NavLink>
                <NavLink view="projects" icon={<BriefcaseIcon />}>Projects</NavLink>
                <NavLink view="clients" icon={<UsersIcon />}>Clients</NavLink>
                <NavLink view="timetracking" icon={<ClockIcon />}>Time Tracking</NavLink>
                <NavLink view="invoices" icon={<FileTextIcon />}>Invoices</NavLink>
                <NavLink view="expenses" icon={<DollarSignIcon />}>Expenses</NavLink>
                <NavLink view="reporting" icon={<ChartBarIcon />}>Reporting</NavLink>
                <NavLink view="team" icon={<TeamIcon />}>Team</NavLink>
            </nav>
            <div className="p-4 border-t dark:border-gray-700 space-y-2">
                 <NavLink view="settings" icon={<SettingsIcon />}>Settings</NavLink>
                <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                        <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${user.name.charAt(0)}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                            <p className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {isDarkMode ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                {sidebarContent}
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Desktop Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                {sidebarContent}
            </div>

            <main className="md:pl-64 flex flex-col flex-1">
                {/* Header for mobile */}
                <header className="md:hidden sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between z-20">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
                    <div className="w-6"></div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};


const App = () => {
    const [user, setUser] = useState(null);

    // In a real app, you'd have an effect here to check for a session token
    // useEffect(() => {
    //   const checkSession = async () => { /* ... */ };
    //   checkSession();
    // }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };
    
    if (!user) {
        return <AuthView onLogin={handleLogin} />;
    }
    
    return <MainAppView user={user} onLogout={handleLogout} />;
};


export default App;



