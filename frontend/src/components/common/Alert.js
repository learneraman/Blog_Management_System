/**
 * Alert Component
 * Displays error, success, warning, or info messages
 */

import React, { useEffect, useState } from 'react';

const Alert = ({ message, type = 'info', onClose, duration = 3000, showIcon = true }) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  const getStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease-in-out',
    };

    const typeStyles = {
      success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
      },
      error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
      },
      warning: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeaa7',
      },
      info: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const iconMap = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ⓘ',
    };
    return iconMap[type];
  };

  return (
    <div style={getStyles()}>
      {showIcon && <span style={{ fontSize: '18px' }}>{getIcon()}</span>}
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        style={{
          marginLeft: 'auto',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          color: 'inherit',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
