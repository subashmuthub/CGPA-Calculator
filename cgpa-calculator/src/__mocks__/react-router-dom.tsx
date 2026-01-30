import React from 'react';

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn(() => ({ pathname: '/', state: null }));

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Routes = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Route = ({ element }: { element: React.ReactNode }) => <div>{element}</div>;
export const Navigate = () => <div>Navigate</div>;
export const Link = ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>;
export const useNavigate = () => mockNavigate;
export const useLocation = () => mockUseLocation();
export const useParams = () => ({});

export { mockNavigate, mockUseLocation };
