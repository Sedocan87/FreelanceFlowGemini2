export const initialClients = [
    { id: 1, name: 'Innovate Inc.', email: 'contact@innovate.com', projects: 2 },
    { id: 2, name: 'Quantum Solutions', email: 'hello@quantum.dev', projects: 1 },
    { id: 3, name: 'Apex Designs', email: 'support@apexdesigns.io', projects: 3 },
];

export const initialProjects = [
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

export const initialTimeEntries = [
    { id: 1, projectId: 1, hours: 2.5, date: '2025-09-18', description: 'Worked on UI mockups for the home screen.', memberId: 2, isBilled: false },
    { id: 2, projectId: 3, hours: 4.0, date: '2025-09-18', description: 'Initial project setup and dependency installation.', memberId: 1, isBilled: false },
    { id: 3, projectId: 1, hours: 3.0, date: '2025-09-17', description: 'Client meeting to discuss feedback on wireframes.', memberId: 2, isBilled: false },
    { id: 4, projectId: 2, hours: 8.0, date: '2025-07-16', description: 'Deployed final version to production.', memberId: 1, isBilled: true },
    { id: 5, projectId: 4, hours: 5.2, date: '2025-08-15', description: 'Initial data modeling.', memberId: 3, isBilled: false },
    { id: 6, projectId: 3, hours: 3.5, date: '2025-09-12', description: 'Set up staging environment.', memberId: 1, isBilled: false },
    { id: 7, projectId: 1, hours: 5.0, date: '2025-09-11', description: 'Component library research.', memberId: 2, isBilled: false },
];

export const initialInvoices = [
    { id: 'INV-001', clientName: 'Innovate Inc.', issueDate: '2025-07-17', dueDate: '2025-08-17', amount: 950.00, status: 'Paid', currency: 'USD', items: []},
    { id: 'INV-002', clientName: 'Quantum Solutions', issueDate: '2025-08-20', dueDate: '2025-09-20', amount: 780.00, status: 'Paid', currency: 'USD', items: []},
];

export const initialExpenses = [
    { id: 1, projectId: 1, description: 'Stock Photos License', amount: 75.00, date: '2025-09-10', isBilled: false, isBillable: true },
    { id: 2, projectId: 3, description: 'Premium WordPress Plugin', amount: 59.99, date: '2025-09-12', isBilled: false, isBillable: true },
    { id: 3, projectId: 2, description: 'Server Hosting (Q3)', amount: 150.00, date: '2025-07-01', isBilled: true, isBillable: true },
    { id: 4, projectId: 1, description: 'New Keyboard', amount: 120.00, date: '2025-09-15', isBilled: false, isBillable: false },
];

export const initialUserProfile = {
    companyName: 'Your Company',
    companyEmail: 'your.email@example.com',
    companyAddress: '123 Freelance St, Work City',
    logo: null,
};

export const initialTeamMembers = (currentUser) => [
    { id: 1, name: currentUser.name, email: currentUser.email, role: 'Admin', rate: 75 },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Member', rate: 50 },
    { id: 3, name: 'John Smith', email: 'john.smith@example.com', role: 'Member', rate: 60 },
];

export const initialRecurringInvoices = [
    { id: 1, clientName: 'Innovate Inc.', frequency: 'Monthly', nextDueDate: '2025-10-01', amount: 2500, items: [{ description: 'Monthly Marketing Retainer', amount: 2500 }], currency: 'USD' },
    { id: 2, clientName: 'Apex Designs', frequency: 'Quarterly', nextDueDate: '2025-11-15', amount: 750, items: [{ description: 'Quarterly Website Maintenance', amount: 750 }], currency: 'GBP' },
];

export const initialTaxSettings = {
    rate: 25,
};

export const initialCurrencySettings = {
    default: 'USD',
};
