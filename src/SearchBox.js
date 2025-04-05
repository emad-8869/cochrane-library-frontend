// src/SearchBox.js
// Component for handling topic search with auto-suggestions

import React, { useState, useEffect, useRef } from 'react';
import { fetchReviews, extractTopics } from './api'; // Utilities to load and parse topic data

// This component shows an input box and dropdown suggestions
// onFilterChange is a callback from App.js to apply the selected topic filter
const SearchBox = ({ onFilterChange }) => {
  // Stores user input from the search box
  const [searchTerm, setSearchTerm] = useState('');

  // Stores current filtered suggestions from the topics list
  const [suggestions, setSuggestions] = useState([]);

  // Stores all unique topics available in the dataset
  const [topics, setTopics] = useState([]);

  // Controls whether the suggestion dropdown is shown
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Used to detect clicks outside of the dropdown
  const suggestionRef = useRef(null);

  // Fetch and extract all topics when the component mounts
  useEffect(() => {
    const loadTopics = async () => {
      const allReviews = await fetchReviews(); // Load full dataset
      const allTopics = extractTopics(allReviews); // Extract unique topics
      console.log("🔍 All extracted topics:", allTopics); // Optional debug
      setTopics(allTopics);
    };
    loadTopics();
  }, []);

  // Fires when the user types in the search box
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      // Clear suggestions if input is empty
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      // Show matching topics that include the input substring (case-insensitive)
      const filteredTopics = topics.filter(topic =>
        topic.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredTopics);
      setShowSuggestions(true);
    }
  };

  // Called when a user clicks a suggestion from the dropdown
  const handleSuggestionClick = (topic) => {
    setSearchTerm(''); // Clear the input
    setShowSuggestions(false); // Close dropdown
    onFilterChange(topic); // Send selected topic back to App.js
  };

  // Clears the current search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    onFilterChange(null); // Resets filter in App.js
  };

  // Detects clicks outside of the suggestion dropdown and closes it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={suggestionRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by topic..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        {/* Show the clear (×) button only when there's input */}
        {searchTerm && (
          <button className="clear-search" onClick={handleClearSearch} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      {/* Show dropdown suggestions only if matches exist */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((topic, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(topic)}
              className="suggestion-item"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;