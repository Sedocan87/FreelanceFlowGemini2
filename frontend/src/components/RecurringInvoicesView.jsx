import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Dialog from './Dialog';
import EditIcon from './EditIcon';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import TrashIcon from './TrashIcon';
import { formatCurrency, CURRENCIES } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { getRecurringInvoices, addRecurringInvoice, updateRecurringInvoice, deleteRecurringInvoice } from '../api';

const RecurringInvoicesView = ({ clients }) => {
    const { idToken } = useAuth();
    const [recurringInvoices, setRecurringInvoices] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRecurring, setEditingRecurring] = useState(null);
    const [recurringToDelete, setRecurringToDelete] = useState(null);

    const defaultFormState = {
        clientId: clients.length > 0 ? clients[0].id : '',
        frequency: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        lineItems: [{ description: '', amount: '' }],
        currency: 'USD',
    };

    const [formState, setFormState] = useState(defaultFormState);

    useEffect(() => {
        const fetchRecurringInvoices = async () => {
            if (idToken) {
                try {
                    const data = await getRecurringInvoices(idToken);
                    setRecurringInvoices(data);
                } catch (error) {
                    console.error('Error fetching recurring invoices:', error);
                }
            }
        };
        fetchRecurringInvoices();
    }, [idToken]);

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
            clientId: rec.clientId,
            frequency: rec.frequency,
            startDate: rec.nextDueDate,
            lineItems: rec.items,
            currency: rec.currency,
        });
        setIsDialogOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const totalAmount = formState.lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const recurringData = {
            clientId: formState.clientId,
            frequency: formState.frequency,
            nextDueDate: formState.startDate,
            amount: totalAmount,
            currency: formState.currency,
            items: formState.lineItems.map(item => ({ ...item, amount: parseFloat(item.amount) || 0 }))
        };

        try {
            if (editingRecurring) {
                const updated = await updateRecurringInvoice(editingRecurring.id, recurringData, idToken);
                setRecurringInvoices(recurringInvoices.map(r => r.id === editingRecurring.id ? updated : r));
            } else {
                const added = await addRecurringInvoice(recurringData, idToken);
                setRecurringInvoices([added, ...recurringInvoices]);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving recurring invoice:', error);
        }
    };

    const handleDelete = async () => {
        if (recurringToDelete) {
            try {
                await deleteRecurringInvoice(recurringToDelete.id, idToken);
                setRecurringInvoices(recurringInvoices.filter(r => r.id !== recurringToDelete.id));
                setRecurringToDelete(null);
            } catch (error) {
                console.error('Error deleting recurring invoice:', error);
            }
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
                           <Label htmlFor="clientId">Client</Label>
                           <Select id="clientId" value={formState.clientId} onChange={handleFormStateChange}>
                               {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

export default RecurringInvoicesView;
