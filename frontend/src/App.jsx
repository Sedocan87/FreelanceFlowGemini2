import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthView from './components/AuthView';
import MainAppView from './components/MainAppView';
import { auth } from './firebase'; // To get the logout function

const App = () => {
    const { currentUser } = useAuth();

    const handleLogout = () => {
        auth.signOut();
    };

    if (!currentUser) {
        // We don't need to pass onLogin anymore because
        // the AuthContext will handle the state change.
        return <AuthView />;
    }

    // We can pass the currentUser from the context and the handleLogout function
    // to the main application view.
    return <MainAppView user={currentUser} onLogout={handleLogout} />;
};

export default App;
