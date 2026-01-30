import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DemoLogin: React.FC = () => {
  const { login } = useAuth();

  const handleDemoLogin = async () => {
    try {
      await login('test@example.com', 'password123');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          🚀 Quick Demo Access
        </h3>
        <p className="text-blue-600 mb-4 text-sm">
          Click below for instant access with demo credentials
        </p>
        
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="text-left space-y-1 text-sm">
            <div><strong>Email:</strong> <code className="bg-gray-100 px-2 py-1 rounded">test@example.com</code></div>
            <div><strong>Password:</strong> <code className="bg-gray-100 px-2 py-1 rounded">password123</code></div>
            <div className="text-xs text-gray-500 mt-2">
              ✅ Pre-loaded with sample CGPA data • ✅ All features unlocked
            </div>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg 
                     hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 
                     shadow-lg hover:shadow-xl font-semibold"
        >
          🎯 Auto-Login with Demo Account
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <div className="grid grid-cols-2 gap-2 text-left">
            <div>✓ Grade System: O(10), A+(9), A(8), B+(7), B(6), C(5), U(0)</div>
            <div>✓ Semesters: ODD/EVEN format</div>
            <div>✓ Sample Data: Data Structures course</div>
            <div>✓ CGPA: 8.0/10.0 with 4 credits</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;