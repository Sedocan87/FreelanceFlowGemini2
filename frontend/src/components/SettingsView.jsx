import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Textarea from './Textarea';
import LogOutIcon from './LogOutIcon';
import { CURRENCIES } from '../utils/formatCurrency';

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

export default SettingsView;
