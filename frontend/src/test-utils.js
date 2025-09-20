import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from './contexts/AuthContext';

const AllTheProviders = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
