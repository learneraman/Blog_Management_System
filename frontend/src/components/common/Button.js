/**
 * Button Component
 * Reusable button with multiple variants and states
 */

import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
      },
      secondary: {
        backgroundColor: '#f3f4f6',
        color: '#111827',
        border: '1px solid #d1d5db',
      },
      success: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#6366f1',
        border: '1px solid #6366f1',
      },
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '6px 12px',
        fontSize: '12px',
        borderRadius: '4px',
      },
      md: {
        padding: '10px 16px',
        fontSize: '14px',
        borderRadius: '6px',
      },
      lg: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
      },
    };
    return sizes[size] || sizes.md;
  };

  const baseStyles = {
    fontWeight: '500',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={combinedStyles}
      className={className}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
