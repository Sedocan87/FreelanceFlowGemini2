import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Textarea from './Textarea';
import LogOutIcon from './LogOutIcon';
import { CURRENCIES } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { getSettings, updateSettings } from '../api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SettingsView = ({ user, onLogout }) => {
    const { idToken } = useAuth();
    const [settings, setSettings] = useState({
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        logoUrl: '',
        taxRate: 0,
        defaultCurrency: 'USD',
    });
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [stripeError, setStripeError] = useState(null);
    const [stripeLoading, setStripeLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            if (idToken) {
                try {
                    const data = await getSettings(idToken);
                    setSettings(data);
                } catch (error) {
                    console.error('Error fetching settings:', error);
                }
            }
        };
        fetchSettings();
    }, [idToken]);

    const handleSettingsChange = (e) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload this to a server and get a URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(prev => ({ ...prev, logoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await updateSettings(settings, idToken);
            setIsEditingCompany(false);
            alert("Settings saved.");
        } catch (error) {
            console.error('Error saving settings:', error);
            alert("Failed to save settings.");
        }
    };

    const handleUpgradeClick = async () => {
        setStripeLoading(true);
        setStripeError(null);
        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
                    successUrl: window.location.origin + '/dashboard', // Redirect here on success
                    cancelUrl: window.location.href, // Return here on cancellation
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session.');
            }

            const { sessionId } = await response.json();
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                setStripeError(error.message);
            }
        } catch (error) {
            setStripeError(error.message);
        } finally {
            setStripeLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your account and preferences.</p>

            <div className="mt-8 space-y-8">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Company Information</h3>
                        {!isEditingCompany && <Button variant="secondary" onClick={() => setIsEditingCompany(true)}>Edit</Button>}
                    </div>
                    {isEditingCompany ? (
                        <form onSubmit={handleSaveSettings}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" value={settings.companyName || ''} onChange={handleSettingsChange} />
                                </div>
                                <div>
                                    <Label htmlFor="companyEmail">Company Email</Label>
                                    <Input id="companyEmail" type="email" value={settings.companyEmail || ''} onChange={handleSettingsChange} />
                                </div>
                                <div>
                                    <Label htmlFor="companyAddress">Company Address</Label>
                                    <Textarea id="companyAddress" value={settings.companyAddress || ''} onChange={handleSettingsChange} />
                                </div>
                                <div>
                                    <Label htmlFor="logo">Company Logo</Label>
                                    <Input id="logo" type="file" onChange={handleLogoChange} accept="image/*" />
                                    {settings.logoUrl && <img src={settings.logoUrl} alt="logo" className="w-24 mt-2"/>}
                                </div>
                                <div>
                                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                    <Input id="taxRate" type="number" step="0.01" value={settings.taxRate || 0} onChange={handleSettingsChange} />
                                </div>
                                <div>
                                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                                    <Select id="defaultCurrency" value={settings.defaultCurrency || 'USD'} onChange={handleSettingsChange}>
                                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setIsEditingCompany(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-2">
                            <p><strong>Company Name:</strong> {settings.companyName}</p>
                            <p><strong>Company Email:</strong> {settings.companyEmail}</p>
                            <p><strong>Tax Rate:</strong> {settings.taxRate}%</p>
                            <p><strong>Default Currency:</strong> {settings.defaultCurrency}</p>
                        </div>
                    )}
                </Card>

                 <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subscription</h3>
                    <div className="flex justify-between items-center">
                        <div>
                           <p className="font-medium">Current Plan: <span className="text-gray-600 dark:text-gray-400">Free</span></p>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Upgrade to Pro for advanced features.</p>
                        </div>
                        <Button onClick={handleUpgradeClick} disabled={stripeLoading}>
                            {stripeLoading ? 'Redirecting...' : 'Upgrade to Pro'}
                        </Button>
                    </div>
                    {stripeError && <p className="text-red-500 text-sm mt-2">{stripeError}</p>}
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

export default SettingsView;
