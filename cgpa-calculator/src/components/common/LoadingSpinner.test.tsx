import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';
import '@testing-library/jest-dom';

describe('LoadingSpinner Component', () => {
  test('renders with default props', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8', 'h-8'); // medium is default
  });

  test('renders loading spinner with small size', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  test('renders loading spinner with large size', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('renders with message when provided', () => {
    render(<LoadingSpinner message="Processing..." />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  test('does not render message when not provided', () => {
    const { container } = render(<LoadingSpinner />);
    const message = container.querySelector('p');
    expect(message).not.toBeInTheDocument();
  });

  test('animation classes are applied correctly', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin');
  });

  test('renders with correct structure', () => {
    const { container } = render(<LoadingSpinner />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'bg-gray-50');
  });
});