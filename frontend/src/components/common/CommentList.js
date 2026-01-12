/**
 * CommentList Component
 * Displays a list of comments with delete functionality
 */

import React from 'react';
import { formatDateTime } from '../../utils/formatters';

const CommentList = ({ comments = [], onDeleteComment, currentUserId }) => {
  if (!comments || comments.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {comments.map((comment) => (
        <div
          key={comment._id}
          style={{
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderLeft: '3px solid #6366f1',
            borderRadius: '4px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <strong style={{ color: '#111827' }}>{comment.user?.name || 'Anonymous'}</strong>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {formatDateTime(comment.createdAt)}
              </div>
            </div>
            {currentUserId === comment.user?._id && (
              <button
                onClick={() => onDeleteComment?.(comment._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '0',
                }}
              >
                Delete
              </button>
            )}
          </div>
          <p style={{ margin: '0', color: '#374151', lineHeight: '1.6' }}>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
