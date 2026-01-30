import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleDemo = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    console.log('🎯 Demo login button clicked!');
    try {
      console.log('Attempting login with test@example.com...');
      console.log('Backend URL:', process.env.REACT_APP_API_URL || 'http://localhost:5001/api');
      
      const result = await login('test@example.com', 'password123');
      console.log('Login result:', result);
      
      if (result) {
        console.log('✅ Demo login successful!');
        // Force navigation to dashboard
        navigate('/dashboard');
      } else {
        console.log('❌ Demo login failed - login function returned false');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-green-800 mb-2">🚀 Quick Demo Access</h3>
      <div className="bg-white rounded p-3 mb-3 border">
        <p className="text-sm text-gray-700">
          <strong className="text-green-700">📧 Email:</strong> test@example.com<br/>
          <strong className="text-green-700">🔒 Password:</strong> password123<br/>
          <span className="text-xs text-gray-500">✅ Pre-loaded with sample CGPA data</span>
        </p>
      </div>
      <button
        onClick={handleDemoLogin}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all"
      >
        🎯 Auto-Login Demo Account
      </button>
      <p className="text-xs text-center text-gray-600 mt-2">
        One-click login • No typing required!
      </p>
    </div>
  );
};

export default SimpleDemo;