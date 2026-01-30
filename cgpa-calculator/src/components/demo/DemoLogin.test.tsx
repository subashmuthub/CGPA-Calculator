import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DemoLogin from './DemoLogin';
import '@testing-library/jest-dom';

const renderDemoLogin = () => {
  return render(
    <BrowserRouter>
      <DemoLogin />
    </BrowserRouter>
  );
};

describe('DemoLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders demo login button', () => {
    renderDemoLogin();
    expect(screen.getByRole('button', { name: /try demo/i })).toBeInTheDocument();
  });

  test('shows demo description', () => {
    renderDemoLogin();
    expect(screen.getByText(/test the calculator/i)).toBeInTheDocument();
  });

  test('opens demo modal when button is clicked', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    
    fireEvent.click(demoButton);
    
    expect(screen.getByText(/demo mode/i)).toBeInTheDocument();
  });

  test('closes demo modal when close button is clicked', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    
    // Open modal
    fireEvent.click(demoButton);
    expect(screen.getByText(/demo mode/i)).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByText(/demo mode/i)).not.toBeInTheDocument();
  });

  test('renders demo calculator inside modal', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    
    fireEvent.click(demoButton);
    
    expect(screen.getByText(/add subject/i)).toBeInTheDocument();
  });

  test('has accessible modal attributes', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    
    fireEvent.click(demoButton);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('demo button has correct styling', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    expect(demoButton).toHaveClass('bg-green-600');
  });

  test('shows demo limitations warning', () => {
    renderDemoLogin();
    const demoButton = screen.getByRole('button', { name: /try demo/i });
    
    fireEvent.click(demoButton);
    
    expect(screen.getByText(/note: demo calculations/i)).toBeInTheDocument();
  });
});