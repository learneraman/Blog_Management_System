/**
 * LikeButton Component
 * Reusable like button for blogs and comments
 */

import React, { useState } from 'react';

const LikeButton = ({
  isLiked = false,
  likesCount = 0,
  onLikeChange,
  disabled = false,
  size = 'md',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getSizeStyles = () => {
    const sizes = {
      sm: { fontSize: '14px', padding: '4px 8px' },
      md: { fontSize: '16px', padding: '6px 12px' },
      lg: { fontSize: '18px', padding: '8px 16px' },
    };
    return sizes[size] || sizes.md;
  };

  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onLikeChange?.(!isLiked);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = {
    background: isLiked ? '#fee2e2' : '#f3f4f6',
    color: isLiked ? '#dc2626' : '#6b7280',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    opacity: disabled || isLoading ? 0.6 : 1,
    ...getSizeStyles(),
  };

  return (
    <button style={buttonStyles} onClick={handleClick} disabled={disabled || isLoading}>
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
