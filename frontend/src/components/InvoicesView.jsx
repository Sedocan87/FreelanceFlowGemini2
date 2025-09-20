import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Dialog from './Dialog';
import Label from './Label';
import Select from './Select';
import InvoiceDetailView from './InvoiceDetailView';
import RecurringInvoicesView from './RecurringInvoicesView';
import { formatCurrency, CURRENCIES } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { getTimeEntries, getExpenses, addInvoice, updateTimeEntry, updateExpense } from '../api';

const InvoicesView = ({ projects, clients, invoices, setInvoices, pdfLibrariesLoaded, userProfile }) => {
    const { idToken } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(clients.length > 0 ? clients[0].id : '');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [activeTab, setActiveTab] = useState('one-time');
    const [timeEntries, setTimeEntries] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (idToken) {
                try {
                    const [timeData, expenseData] = await Promise.all([
                        getTimeEntries(idToken),
                        getExpenses(idToken)
                    ]);
                    setTimeEntries(timeData);
                    setExpenses(expenseData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [idToken]);

    const handleGenerateInvoice = async () => {
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
            const rate = project?.billing?.type === 'Hourly' ? project.billing.rate : 100;
            return {
                description: `${project?.name || 'Project'} - ${entry.description || 'Work done'} on ${entry.date}`,
                amount: entry.hours * rate,
            }
        });

        const expenseInvoiceItems = unbilledExpenses.map(expense => ({
            description: `Expense: ${expense.description} on ${expense.date}`,
            amount: expense.amount,
        }));

        const items = [...timeInvoiceItems, ...expenseInvoiceItems];
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

        const newInvoice = {
            clientId: clientObj.id,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Draft',
            currency: selectedCurrency,
            items: items,
        };

        try {
            const addedInvoice = await addInvoice(newInvoice, idToken);
            setInvoices([addedInvoice, ...invoices]);

            for (const entry of unbilledEntries) {
                await updateTimeEntry(entry.id, { ...entry, isBilled: true }, idToken);
            }
            const billedEntryIds = unbilledEntries.map(entry => entry.id);
            setTimeEntries(timeEntries.map(entry =>
                billedEntryIds.includes(entry.id) ? { ...entry, isBilled: true } : entry
            ));

            for (const expense of unbilledExpenses) {
                await updateExpense(expense.id, { ...expense, isBilled: true }, idToken);
            }
            const billedExpenseIds = unbilledExpenses.map(exp => exp.id);
            setExpenses(expenses.map(exp =>
                billedExpenseIds.includes(exp.id) ? { ...exp, isBilled: true } : exp
            ));

            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };

    const handleStatusChange = async (invoiceId, newStatus) => {
        try {
            const updatedInvoice = await updateInvoice(invoiceId, { status: newStatus }, idToken);
            setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
            setViewingInvoice(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
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
                <RecurringInvoicesView clients={clients} />
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

export default InvoicesView;
