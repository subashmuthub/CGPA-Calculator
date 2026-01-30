import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';
import '@testing-library/jest-dom';

describe('LoadingSpinner Component', () => {
  test('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders loading spinner with small size', () => {
    render(<LoadingSpinner size="small" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders loading spinner with large size', () => {
    render(<LoadingSpinner size="large" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders with message when provided', () => {
    render(<LoadingSpinner message="Processing..." />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  test('does not render message when not provided', () => {
    render(<LoadingSpinner />);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});