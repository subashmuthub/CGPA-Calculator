import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import '@testing-library/jest-dom';

// Mock axios
const mockAxios: any = {
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    headers: {
      common: {} as Record<string, string>
    }
  }
};
jest.mock('axios', () => mockAxios);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component to access auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.firstName || 'No user'}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => register('John', 'Doe', 'test@example.com', 'password')}>Signup</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('provides default auth state', () => {
    renderWithAuthProvider();
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('initializes with stored token', () => {
    const mockToken = 'fake-jwt-token';
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    
    renderWithAuthProvider();
    
    expect(mockAxios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
  });

  test('successful login updates auth state', async () => {
    const mockResponse = {
      data: {
        token: 'new-token',
        user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', id: '1', isEmailVerified: true }
      }
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(mockAxios.defaults.headers.common['Authorization']).toBe('Bearer new-token');
  });

  test('failed login shows error', async () => {
    mockAxios.post.mockRejectedValue(new Error('Invalid credentials'));

    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('successful signup updates auth state', async () => {
    const mockResponse = {
      data: {
        token: 'signup-token',
        user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', id: '1', isEmailVerified: false }
      }
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    renderWithAuthProvider();
    
    const signupButton = screen.getByText('Signup');
    
    await act(async () => {
      signupButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'signup-token');
  });

  test('logout clears auth state', async () => {
    // First set up authenticated state
    const mockResponse = {
      data: {
        token: 'auth-token',
        user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', id: '1', isEmailVerified: true }
      }
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Now test logout
    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      logoutButton.click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockAxios.defaults.headers.common['Authorization']).toBeUndefined();
  });

  test('loading state is managed correctly', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    mockAxios.post.mockReturnValue(loginPromise);

    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    
    act(() => {
      loginButton.click();
    });

    // Should be loading
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    // Resolve the promise
    await act(async () => {
      resolveLogin({
        data: {
          token: 'token',
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', id: '1', isEmailVerified: true }
        }
      });
    });

    // Should no longer be loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });
});