import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Label from './Label';
import GoogleIcon from './GoogleIcon';

const AuthView = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('user@email.com');
    const [password, setPassword] = useState('password123');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would make an API call here.
        // For this demo, we'll just simulate a successful login/signup.
        if (isLoginView) {
            if (email && password) {
                onLogin({id: 1, name: 'Demo User', email });
            }
        } else {
             if (email && password && name) {
                onLogin({id: 1, name, email });
            }
        }
    };

    const handleGoogleSignIn = () => {
        // In a real app, this would trigger the Google OAuth flow.
        // For this demo, we'll simulate a successful sign-in.
        onLogin({ id: 1, name: 'Google User', email: 'google.user@example.com' });
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
                            onClick={() => setIsLoginView(true)}
                        >
                            Log In
                        </button>
                        <button
                            className={`flex-1 py-3 text-center font-semibold transition-colors ${!isLoginView ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            onClick={() => setIsLoginView(false)}
                        >
                            Sign Up
                        </button>
                    </div>

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
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthView;
