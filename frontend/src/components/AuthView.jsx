import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Label from './Label';
import GoogleIcon from './GoogleIcon';

// This function will call our backend to sync the user
const syncUserWithBackend = async (user) => {
    if (!user) return;
    try {
        const token = await user.getIdToken();
        await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        // The AuthContext will handle the app state change, so no need to do anything here
    } catch (error) {
        console.error('Error syncing user with backend:', error);
    }
};

const AuthView = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Name is only for sign up
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            let userCredential;
            if (isLoginView) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                if (!name) {
                    setError("Name is required for signing up.");
                    return;
                }
                // Note: Firebase doesn't store the 'name' during email/password creation.
                // We'd need to update the user's profile separately if we wanted that.
                // The backend sync will handle getting the name into our DB.
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }
            await syncUserWithBackend(userCredential.user);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await syncUserWithBackend(result.user);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Your all-in-one freelance toolkit.</p>
                </div>
                <Card>
                    <div className="flex border-b dark:border-gray-700 mb-6">
                        <button
                            className={`flex-1 py-3 text-center font-semibold transition-colors ${isLoginView ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            onClick={() => { setIsLoginView(true); setError(''); }}
                        >
                            Log In
                        </button>
                        <button
                            className={`flex-1 py-3 text-center font-semibold transition-colors ${!isLoginView ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            onClick={() => { setIsLoginView(false); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginView && (
                             <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <Button type="submit" className="w-full !mt-6">
                            {isLoginView ? 'Log In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t dark:border-gray-600"></div>
                        <span className="mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t dark:border-gray-600"></div>
                    </div>

                    <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn}>
                        <GoogleIcon className="w-5 h-5 mr-3" />
                        Sign in with Google
                    </Button>

                </Card>
                 <p className="text-center text-sm text-gray-500 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-blue-600 hover:underline ml-1">
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthView;
