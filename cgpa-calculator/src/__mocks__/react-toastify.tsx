import React from 'react';

export const toast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  warning: jest.fn(),
};

export const ToastContainer = () => <div data-testid="toast-container"></div>;
