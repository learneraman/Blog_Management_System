/**
 * Card Component
 * Reusable card wrapper for blog posts and content
 */

import React from 'react';

const Card = ({ children, onClick, hoverable = false, style = {}, className = '' }) => {
  const cardStyles = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: hoverable ? 'pointer' : 'default',
    ...style,
  };

  const handleHover = (isHovering) => {
    if (hoverable) {
      if (isHovering) {
        cardStyles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        cardStyles.transform = 'translateY(-2px)';
      } else {
        cardStyles.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        cardStyles.transform = 'translateY(0)';
      }
    }
  };

  return (
    <div
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className={className}
    >
      {children}
    </div>
  );
};

export default Card;
