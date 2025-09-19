import React from 'react';
import { formatCurrency } from '../utils';
import Card from './Card';
import TaxEstimator from './TaxEstimator';

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

export default DashboardView;
