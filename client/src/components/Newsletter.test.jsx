import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Newsletter from './Newsletter';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../utils/api');
vi.mock('react-hot-toast');
vi.mock('lucide-react', () => ({
    Mail: () => <div data-testid="mail-icon">Mail</div>,
    Users: () => <div data-testid="users-icon">Users</div>,
    CheckCircle: () => <div data-testid="check-icon">Check</div>,
    AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
    Loader2: () => <div data-testid="loader">Loading...</div>
}));

describe('Newsletter Component', () => {
    it('renders correctly', () => {
        render(<Newsletter />);
        expect(screen.getByText(/Join the inner circle/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/engineer@tech.com/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
    });

    it('handles input change', () => {
        render(<Newsletter />);
        const input = screen.getByPlaceholderText(/engineer@tech.com/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(input.value).toBe('test@example.com');
    });

    it('submits the form successfully', async () => {
        api.post.mockResolvedValueOnce({ data: { success: true, message: 'Welcome!' } });
        render(<Newsletter />);

        const input = screen.getByPlaceholderText(/engineer@tech.com/i);
        const button = screen.getByRole('button', { name: /Subscribe/i });

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        // Check for loading state (optional, might be too fast)
        // expect(screen.getByTestId('loader')).toBeInTheDocument();

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/subscribers', { email: 'test@example.com' });
            expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
        });
    });

    it('handles subscription failure', async () => {
        api.post.mockResolvedValueOnce({ data: { success: false, error: 'Failed' } });
        render(<Newsletter />);

        const input = screen.getByPlaceholderText(/engineer@tech.com/i);
        const button = screen.getByRole('button', { name: /Subscribe/i });

        fireEvent.change(input, { target: { value: 'fail@example.com' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/subscribers', { email: 'fail@example.com' });
            expect(screen.getByText(/Subscription failed/i)).toBeInTheDocument();
        });
    });
});
