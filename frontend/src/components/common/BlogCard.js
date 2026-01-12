/**
 * BlogCard Component
 * Displays a blog post card in list view
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, calculateReadingTime, formatExcerpt } from '../../utils/formatters';
import Card from './Card';
import LikeButton from './LikeButton';

const BlogCard = ({
  blog,
  onLike,
  onDelete,
  showAuthor = true,
  showActions = false,
}) => {
  const navigate = useNavigate();
  const readingTime = calculateReadingTime(blog.description);

  const handleCardClick = () => {
    navigate(`/blogs/${blog._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete?.(blog._id);
    }
  };

  return (
    <Card hoverable onClick={handleCardClick}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '18px' }}>
          {blog.title}
        </h3>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
          {showAuthor && <span>{blog.author?.name} • </span>}
          <span>{formatDate(blog.createdAt)} • </span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      <p style={{ margin: '0 0 12px 0', color: '#374151', lineHeight: '1.6' }}>
        {formatExcerpt(blog.description)}
      </p>

      {blog.tags && blog.tags.length > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span style={{ color: '#6b7280', fontSize: '12px' }}>+{blog.tags.length - 3}</span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
          <span>💬 {blog.comments?.length || 0}</span>
          <span>👁️ {blog.views || 0}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            onClick={handleCardClick}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            👁️ View
          </button>
          {showActions && (
            <button
              onClick={handleDelete}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
