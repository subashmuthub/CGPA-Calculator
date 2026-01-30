import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './Auth.css';

const EmailVerification = () => {
  const { token } = useParams<{ token }>();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <LoadingSpinner />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className={status === 'success' ? 'success-icon' : 'auth-icon'}>
            {status === 'success' ? '✅' : '❌'}
          </div>
          <h1>
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          <p>{message}</p>
        </div>

        <div className="auth-footer">
          {status === 'success' ? (
            <p>
              You can now {' '}
              <Link to="/login" className="auth-link">
                sign in to your account
              </Link>
            </p>
          ) : (
            <p>
              Need help? {' '}
              <Link to="/signup" className="auth-link">
                Try signing up again
              </Link>
              {' '} or contact support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;