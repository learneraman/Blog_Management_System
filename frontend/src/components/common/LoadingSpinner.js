/**
 * LoadingSpinner Component
 * Displays a loading spinner
 */

import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: { width: '24px', height: '24px', borderWidth: '2px' },
      md: { width: '40px', height: '40px', borderWidth: '3px' },
      lg: { width: '56px', height: '56px', borderWidth: '4px' },
    };
    return sizes[size] || sizes.md;
  };

  const spinnerStyles = {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    ...getSizeStyles(),
    animation: 'spin 1s linear infinite',
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '40px',
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyles}>
        <div style={spinnerStyles}></div>
        {text && <p style={{ color: '#6b7280', fontSize: '14px' }}>{text}</p>}
      </div>
    </>
  );
};

export default LoadingSpinner;
