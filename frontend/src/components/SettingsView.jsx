import React, { useState } from 'react';
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

// Load Stripe outside of the component render to avoid re-creating the object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SettingsView = ({ user, onLogout, userProfile, setUserProfile, taxSettings, setTaxSettings, currencySettings, setCurrencySettings }) => {
    const { idToken } = useAuth();
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [companyForm, setCompanyForm] = useState(userProfile);
    const [currentTaxRate, setCurrentTaxRate] = useState(taxSettings.rate);
    const [currentDefaultCurrency, setCurrentDefaultCurrency] = useState(currencySettings.default);
    const [stripeError, setStripeError] = useState(null);
    const [stripeLoading, setStripeLoading] = useState(false);

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
