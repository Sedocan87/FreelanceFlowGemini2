import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import Card from './Card';

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

export default TaxEstimator;
