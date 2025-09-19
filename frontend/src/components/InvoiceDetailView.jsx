import React from 'react';
import Button from './Button';
import Card from './Card';
import { formatCurrency } from '../utils/formatCurrency';

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

export default InvoiceDetailView;
