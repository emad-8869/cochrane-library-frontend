// src/App.js - Main application component for displaying Cochrane Reviews

import React, { useState, useEffect, useRef } from 'react';
import { fetchReviews } from './api'; // Custom API fetch logic
import ReviewCard from './ReviewCard'; // Component to display each review
import SearchBox from './SearchBox'; // Component for search + suggestions
import './App.css'; // App styling

const App = () => {
  // State to hold the complete reviews data
  const [reviews, setReviews] = useState([]);

  // State for the list of reviews currently being shown on screen (based on pagination + filter)
  const [displayedReviews, setDisplayedReviews] = useState([]);

  // Tracks if reviews are being loaded initially
  const [loading, setLoading] = useState(true);

  // Current page for pagination logic
  const [page, setPage] = useState(1);

  // Keeps track of the selected topic for filtering
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Prevents multiple triggers of infinite scroll while loading
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reference to the loader element at the bottom of the page
  const loader = useRef(null);

  // Number of reviews shown per page
  const itemsPerPage = 10;

  // Load all reviews when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchReviews(); // Load and flatten the data from JSON
        setReviews(data);
        setDisplayedReviews(data.slice(0, itemsPerPage)); // Show first 10
        setLoading(false);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Called when a topic is selected from the dropdown suggestions
  const handleFilterChange = (topic) => {
    setSelectedTopic(topic); // Save the selected topic
    setPage(1); // Reset pagination

    // Filter reviews by topic if selected, otherwise show all
    const filteredReviews = !topic
      ? reviews
      : reviews.filter(review => review.topic === topic);

    // Show the first page of filtered results
    setDisplayedReviews(filteredReviews.slice(0, itemsPerPage));
  };

  // Clear the filter and show all reviews again
  const removeTopicFilter = () => {
    setSelectedTopic(null);
    setDisplayedReviews(reviews.slice(0, itemsPerPage));
    setPage(1);
  };

  // Set up an intersection observer to handle infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current); // Start watching the loader element
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current); // Clean up
      }
    };
  }, [displayedReviews]);

  // This is triggered when the loader becomes visible
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      loadMoreReviews(); // Fetch more reviews when bottom is reached
    }
  };

  // Load more reviews for pagination (infinite scroll)
  const loadMoreReviews = () => {
    if (isLoadingMore) return; // Prevent multiple triggers

    setIsLoadingMore(true);

    setTimeout(() => {
      // Filter again if a topic is selected
      const filteredReviews = !selectedTopic
        ? reviews
        : reviews.filter(review => review.topic === selectedTopic);

      const nextPage = page + 1;
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Add the next slice to the current display
      if (startIndex < filteredReviews.length) {
        setDisplayedReviews(prev => [
          ...prev,
          ...filteredReviews.slice(startIndex, endIndex)
        ]);
        setPage(nextPage);
      }

      setIsLoadingMore(false);
    }, 300); // Simulate load time
  };

  // Get total count of matching reviews for selected topic
  const getMatchingReviewsCount = () => {
    if (!selectedTopic) return reviews.length;
    return reviews.filter(review => review.topic === selectedTopic).length;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Cochrane Library Reviews</h1>

        {/* Search bar with topic suggestions */}
        <SearchBox onFilterChange={handleFilterChange} />

        {/* Topic filter tag and results count */}
        {selectedTopic && (
          <div className="filter-summary">
            <div className="topic-tags">
              <span>Topics: </span>
              <div className="topic-tag">
                {selectedTopic}
                <button
                  className="remove-tag"
                  onClick={removeTopicFilter}
                  aria-label="Remove topic filter"
                >
                  ×
                </button>
              </div>
            </div>
            <p className="results-count">
              <strong>{getMatchingReviewsCount()}</strong> Cochrane Reviews matching {selectedTopic} in Cochrane Topic
            </p>
          </div>
        )}
      </header>

      {/* Main content area */}
      {loading ? (
        <div className="loading-container">
          <p>Loading reviews...</p>
        </div>
      ) : (
        <main className="reviews-list">
          {/* Show message if no results match */}
          {displayedReviews.length === 0 ? (
            <div className="no-results">
              <p>No reviews found{selectedTopic ? ` for topic: ${selectedTopic}` : ''}.</p>
            </div>
          ) : (
            <>
              {/* Render visible reviews */}
              {displayedReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}

              {/* Infinite scroll loader */}
              <div ref={loader} className="loading">
                {displayedReviews.length < getMatchingReviewsCount()
                  ? 'Loading more...'
                  : 'No more reviews to load.'}
              </div>
            </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Cochrane Library Reviews</p>
      </footer>
    </div>
  );
};

export default App;