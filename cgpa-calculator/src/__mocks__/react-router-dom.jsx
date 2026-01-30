import React from 'react';

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn(() => ({ pathname: '/', state: null }));

export const BrowserRouter = ({ children }: { children }) => <div>{children}</div>;
export const Routes = ({ children }: { children }) => <div>{children}</div>;
export const Route = ({ element }: { element }) => <div>{element}</div>;
export const Navigate = () => <div>Navigate</div>;
export const Link = ({ children, to }) => <a href={to}>{children}</a>;
export const useNavigate = () => mockNavigate;
export const useLocation = () => mockUseLocation();
export const useParams = () => ({});

export { mockNavigate, mockUseLocation };
