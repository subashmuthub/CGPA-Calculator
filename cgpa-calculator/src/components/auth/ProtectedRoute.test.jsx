import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock AuthContext
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  updatePassword: jest.fn()
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children }) => <div>{children}</div>
}));

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (authState = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is authenticated', () => {
    renderProtectedRoute({ isAuthenticated: true });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows loading spinner when authentication is loading', () => {
    renderProtectedRoute({ isLoading: true });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderProtectedRoute({ isAuthenticated: false, isLoading: false });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // The component should redirect, so protected content shouldn't be visible
  });

  test('does not render children when loading', () => {
    renderProtectedRoute({ isAuthenticated: false, isLoading: true });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});