import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SimpleDemo from './SimpleDemo';
import '@testing-library/jest-dom';

const renderSimpleDemo = () => {
  return render(
    <BrowserRouter>
      <SimpleDemo />
    </BrowserRouter>
  );
};

describe('SimpleDemo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders demo title', () => {
    renderSimpleDemo();
    expect(screen.getByText(/try without account/i)).toBeInTheDocument();
  });

  test('renders demo calculator interface', () => {
    renderSimpleDemo();
    expect(screen.getByText(/demo cgpa calculator/i)).toBeInTheDocument();
  });

  test('has add subject button', () => {
    renderSimpleDemo();
    expect(screen.getByRole('button', { name: /add subject/i })).toBeInTheDocument();
  });

  test('adds subject when add button is clicked', () => {
    renderSimpleDemo();
    const addButton = screen.getByRole('button', { name: /add subject/i });
    
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText(/subject name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/credits/i)).toBeInTheDocument();
  });

  test('calculates demo CGPA correctly', () => {
    renderSimpleDemo();
    const addButton = screen.getByRole('button', { name: /add subject/i });
    
    // Add a subject
    fireEvent.click(addButton);
    
    const subjectInput = screen.getByPlaceholderText(/subject name/i);
    const creditInput = screen.getByPlaceholderText(/credits/i);
    const gradeSelect = screen.getByDisplayValue(/select grade/i);
    
    // Fill subject details
    fireEvent.change(subjectInput, { target: { value: 'Math' } });
    fireEvent.change(creditInput, { target: { value: '3' } });
    fireEvent.change(gradeSelect, { target: { value: 'A' } });
    
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    expect(screen.getByText(/cgpa: 4\.0/i)).toBeInTheDocument();
  });

  test('removes subject when remove button is clicked', () => {
    renderSimpleDemo();
    const addButton = screen.getByRole('button', { name: /add subject/i });
    
    // Add a subject
    fireEvent.click(addButton);
    expect(screen.getByPlaceholderText(/subject name/i)).toBeInTheDocument();
    
    // Remove the subject
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(screen.queryByPlaceholderText(/subject name/i)).not.toBeInTheDocument();
  });

  test('shows limitation message', () => {
    renderSimpleDemo();
    expect(screen.getByText(/create account to save/i)).toBeInTheDocument();
  });

  test('has signup link', () => {
    renderSimpleDemo();
    expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
  });

  test('resets demo when reset button is clicked', () => {
    renderSimpleDemo();
    const addButton = screen.getByRole('button', { name: /add subject/i });
    
    // Add a subject
    fireEvent.click(addButton);
    const subjectInput = screen.getByPlaceholderText(/subject name/i);
    fireEvent.change(subjectInput, { target: { value: 'Math' } });
    
    // Reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(screen.queryByPlaceholderText(/subject name/i)).not.toBeInTheDocument();
  });
});