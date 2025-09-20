const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const request = async (endpoint, method, body, token) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const getTimeEntries = (token) => request('/time', 'GET', null, token);
export const addTimeEntry = (data, token) => request('/time', 'POST', data, token);
export const updateTimeEntry = (id, data, token) => request(`/time/${id}`, 'PUT', data, token);
export const deleteTimeEntry = (id, token) => request(`/time/${id}`, 'DELETE', null, token);

export const getProjects = (token) => request('/projects', 'GET', null, token);
export const addProject = (data, token) => request('/projects', 'POST', data, token);
export const updateProject = (id, data, token) => request(`/projects/${id}`, 'PUT', data, token);
export const deleteProject = (id, token) => request(`/projects/${id}`, 'DELETE', null, token);

export const getClients = (token) => request('/clients', 'GET', null, token);
export const addClient = (data, token) => request('/clients', 'POST', data, token);
export const updateClient = (id, data, token) => request(`/clients/${id}`, 'PUT', data, token);
export const deleteClient = (id, token) => request(`/clients/${id}`, 'DELETE', null, token);

export const getInvoices = (token) => request('/invoices', 'GET', null, token);
export const addInvoice = (data, token) => request('/invoices', 'POST', data, token);
export const updateInvoice = (id, data, token) => request(`/invoices/${id}`, 'PUT', data, token);
export const deleteInvoice = (id, token) => request(`/invoices/${id}`, 'DELETE', null, token);

export const getExpenses = (token) => request('/expenses', 'GET', null, token);
export const addExpense = (data, token) => request('/expenses', 'POST', data, token);
export const updateExpense = (id, data, token) => request(`/expenses/${id}`, 'PUT', data, token);
export const deleteExpense = (id, token) => request(`/expenses/${id}`, 'DELETE', null, token);

export const getSettings = (token) => request('/settings', 'GET', null, token);
export const updateSettings = (data, token) => request('/settings', 'PUT', data, token);

export const getTeam = (token) => request('/team', 'GET', null, token);
export const inviteTeamMember = (data, token) => request('/team/invite', 'POST', data, token);
export const updateTeamMember = (id, data, token) => request(`/team/${id}`, 'PUT', data, token);
export const deleteTeamMember = (id, token) => request(`/team/${id}`, 'DELETE', null, token);

export const getRecurringInvoices = (token) => request('/recurring-invoices', 'GET', null, token);
export const addRecurringInvoice = (data, token) => request('/recurring-invoices', 'POST', data, token);
export const updateRecurringInvoice = (id, data, token) => request(`/recurring-invoices/${id}`, 'PUT', data, token);
export const deleteRecurringInvoice = (id, token) => request(`/recurring-invoices/${id}`, 'DELETE', null, token);
