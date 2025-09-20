import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import TimeTrackingView from './TimeTrackingView';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

jest.mock('../firebase');
jest.mock('firebase/auth');
jest.mock('../contexts/AuthContext');
jest.mock('../api');

const mockProjects = [
    { id: 1, name: 'Project 1', tracked: 10 },
    { id: 2, name: 'Project 2', tracked: 20 },
];

test('renders TimeTrackingView and logs time', async () => {
    useAuth.mockReturnValue({ idToken: 'test-token' });
    api.getTimeEntries.mockResolvedValue([]);
    api.addTimeEntry.mockResolvedValue({
        id: 1,
        projectId: 1,
        hours: 1,
        date: '2025-01-01',
        description: 'Test entry',
        isBilled: false,
    });

    await act(async () => {
        render(<TimeTrackingView projects={mockProjects} setProjects={() => {}} user={{ id: 1 }} />);
    });


    await waitFor(() => {
        expect(screen.getByRole('button', { name: /log time/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/hours/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test entry' } });
    fireEvent.click(screen.getByRole('button', { name: /log time/i }));

    await waitFor(() => {
        expect(api.addTimeEntry).toHaveBeenCalledWith(
            expect.objectContaining({
                hours: 1,
                description: 'Test entry',
            }),
            'test-token'
        );
    });
});
