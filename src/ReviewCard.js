// src/ReviewCard.js
// Component for rendering an individual review card

import React from 'react';
import { formatDate } from './api'; // Utility to format date into readable form

// Reusable component to display a single review item
// Props: `review` — object with title, author(s), topic, date, and URL
const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      {/* Title linked to the review's URL */}
      <h2 className="review-title">
        <a href={review.url} target="_blank" rel="noopener noreferrer">
          {review.title}
        </a>
      </h2>

      {/* Author(s) line below the title */}
      <p className="review-author">{review.authors}</p>

      {/* Metadata row: topic + formatted date */}
      <p className="review-meta">
        <span className="review-topic">{review.topic}</span>
        <span className="review-date">{formatDate(review.date)}</span>
      </p>
    </div>
  );
};

export default ReviewCard;