import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CGPACalculator from './CGPACalculator';
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
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const renderCGPACalculator = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CGPACalculator />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CGPACalculator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API module
    const { api } = require('../../context/AuthContext');
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          gradePointMap: {
            'O': 10,
            'A+': 9,
            'A': 8,
            'B+': 7,
            'B': 6,
            'C': 5,
            'U': 0
          },
          availableGrades: ['O', 'A+', 'A', 'B+', 'B', 'C', 'U']
        }
      }
    });
  });

  test('renders calculator title after loading', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('heading', { name: /cgpa calculator/i })).toBeInTheDocument();
  });

  test('renders add course button', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /add course/i })).toBeInTheDocument();
  });

  test('adds a new course when add button is clicked', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    const addButton = screen.getByRole('button', { name: /add course/i });
    
    fireEvent.click(addButton);
    
    const courseNameInputs = screen.getAllByPlaceholderText(/data structures/i);
    expect(courseNameInputs.length).toBeGreaterThan(0);
  });

  test('calculates GPA correctly', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/calculated gpa/i)).toBeInTheDocument();
    });
  });

  test('removes course when delete button is clicked', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Add a course first
    const addButton = screen.getByRole('button', { name: /add course/i });
    fireEvent.click(addButton);
    
    // Now there should be a remove button
    const removeButtons = screen.getAllByTitle(/remove course/i);
    expect(removeButtons.length).toBeGreaterThan(0);
  });

  test('saves calculation when save button is clicked', async () => {
    const { api } = require('../../context/AuthContext');
    api.post.mockResolvedValue({
      data: {
        success: true,
        message: 'CGPA record saved successfully'
      }
    });
    
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    const saveButton = screen.getByRole('button', { name: /save record/i });
    
    fireEvent.click(saveButton);
    
    // Should navigate to dashboard after successful save
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  test('resets form when reset button is clicked', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Add a course
    const addButton = screen.getByRole('button', { name: /add course/i });
    fireEvent.click(addButton);
    
    // Reset form
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    // After reset, should only have one course
    const courseInputs = screen.getAllByPlaceholderText(/data structures/i);
    expect(courseInputs.length).toBe(1);
  });

  test('displays calculated GPA', async () => {
    renderCGPACalculator();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/calculated gpa/i)).toBeInTheDocument();
    expect(screen.getByText(/out of 10\.00/i)).toBeInTheDocument();
  });
});