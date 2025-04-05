// src/api.js
// This file contains utility functions for fetching and formatting review data

// Fetch reviews from the JSON file located in the public folder
export const fetchReviews = async () => {
  try {
    // Request the reviews data
    const response = await fetch('/cochrane_reviews.json');
    console.log('Fetching JSON status:', response.status); // Helps track status during development

    // If request failed, throw an error
    if (!response.ok) throw new Error('Failed to fetch reviews');

    // Convert response to JSON
    const jsonData = await response.json();

    // Flatten the result in case it's nested arrays (safety check)
    const flat = jsonData.flat();
    console.log('Loaded reviews:', flat.length); // Log total reviews loaded

    return flat;
  } catch (err) {
    // Log and handle fetch or parsing errors
    console.error('Error in fetchReviews:', err);
    return []; // Return empty array to avoid crashing app
  }
};

// Extract unique topics from the reviews dataset
export const extractTopics = (reviews) => {
  // Exit early if input isn't a valid non-empty array
  if (!Array.isArray(reviews) || reviews.length === 0) return [];

  // Handle inconsistencies in property casing: some reviews might use "Topic" or "topic"
  const sampleReview = reviews[0];
  const topicKey = 'topic' in sampleReview ? 'topic' : 
                   'Topic' in sampleReview ? 'Topic' : null;

  // If no topic key is found at all, exit with a warning
  if (!topicKey) {
    console.error('❌ No topic key found');
    return [];
  }

  // Use a Set to extract unique topic names
  const uniqueTopics = [...new Set(reviews.map(r => r[topicKey]))];
  console.log(`✅ Extracted ${uniqueTopics.length} topics`);
  return uniqueTopics;
};

// Format the review's date nicely for display
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);

    // If the date is invalid, return it as-is
    if (isNaN(date.getTime())) return dateString;

    // Format the date using US style (Month Day, Year)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    // Fallback in case of formatting errors
    return dateString;
  }
};