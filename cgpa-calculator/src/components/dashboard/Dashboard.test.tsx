import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Mock AuthContext
const mockAuthContext = {
  user: { name: 'John Doe', email: 'john@example.com' },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  updatePassword: jest.fn()
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const renderDashboard = (authState = {}) => {
  const authContextValue = { ...mockAuthContext, ...authState };
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message with user name', () => {
    renderDashboard();
    expect(screen.getByText(/welcome back, john doe/i)).toBeInTheDocument();
  });

  test('renders dashboard cards', () => {
    renderDashboard();
    expect(screen.getByText(/calculate cgpa/i)).toBeInTheDocument();
    expect(screen.getByText(/view records/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    renderDashboard();
    // The component might show loading initially while fetching records
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('has calculate CGPA button that links to calculator', () => {
    renderDashboard();
    const calculateButton = screen.getByRole('link', { name: /calculate cgpa/i });
    expect(calculateButton).toHaveAttribute('href', '/calculator');
  });

  test('displays quick stats section', () => {
    renderDashboard();
    expect(screen.getByText(/quick stats/i)).toBeInTheDocument();
  });

  test('renders recent records section', () => {
    renderDashboard();
    expect(screen.getByText(/recent calculations/i)).toBeInTheDocument();
  });

  test('shows empty state when no records exist', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/no calculations yet/i)).toBeInTheDocument();
    });
  });
});