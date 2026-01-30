import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthProvider } from '../context/AuthContext';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' })
}));

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

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const renderNavbar = (authState = {}) => {
  const authContextValue = { ...mockAuthContext, ...authState };
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with logo and title', () => {
    renderNavbar();
    expect(screen.getByText('CGPA Calculator')).toBeInTheDocument();
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  test('shows login and signup buttons when not authenticated', () => {
    renderNavbar({ isAuthenticated: false });
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('shows dashboard and calculator links when authenticated', () => {
    renderNavbar({ 
      isAuthenticated: true, 
      user: { name: 'John Doe', email: 'john@example.com' } 
    });
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /calculator/i })).toBeInTheDocument();
  });

  test('shows user menu when authenticated', () => {
    renderNavbar({ 
      isAuthenticated: true, 
      user: { name: 'John Doe', email: 'john@example.com' } 
    });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    renderNavbar({ 
      isAuthenticated: true, 
      user: { name: 'John Doe', email: 'john@example.com' } 
    });
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockAuthContext.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('logo links to dashboard when authenticated', () => {
    renderNavbar({ isAuthenticated: true });
    const logoLink = screen.getByRole('link', { name: /🎓 cgpa calculator/i });
    expect(logoLink).toHaveAttribute('href', '/dashboard');
  });

  test('logo links to login when not authenticated', () => {
    renderNavbar({ isAuthenticated: false });
    const logoLink = screen.getByRole('link', { name: /🎓 cgpa calculator/i });
    expect(logoLink).toHaveAttribute('href', '/login');
  });
});