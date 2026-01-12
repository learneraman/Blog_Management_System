/**
 * EmptyState Component
 * Displays empty state when no data is available
 */

import React from 'react';

const EmptyState = ({ icon = '📭', title = 'No Data', description = 'Nothing to display here' }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#6b7280',
  };

  const iconStyles = {
    fontSize: '64px',
    marginBottom: '16px',
  };

  const titleStyles = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  };

  const descriptionStyles = {
    fontSize: '14px',
    color: '#6b7280',
  };

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>{icon}</div>
      <h3 style={titleStyles}>{title}</h3>
      <p style={descriptionStyles}>{description}</p>
    </div>
  );
};

export default EmptyState;
