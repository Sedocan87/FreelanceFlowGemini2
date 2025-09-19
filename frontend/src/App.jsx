import React, { useState } from 'react';
import AuthView from './components/AuthView';
import MainAppView from './components/MainAppView';

const App = () => {
    const [user, setUser] = useState(null);

    // In a real app, you'd have an effect here to check for a session token
    // useEffect(() => {
    //   const checkSession = async () => { /* ... */ };
    //   checkSession();
    // }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    if (!user) {
        return <AuthView onLogin={handleLogin} />;
    }

    return <MainAppView user={user} onLogout={handleLogout} />;
};

export default App;
