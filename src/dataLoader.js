// src/dataLoader.js - Deep analysis version
// This loader was created to analyze and flexibly handle inconsistent or deeply nested review data structures

// Main function to load and parse the reviews data
export const loadReviewsData = async () => {
  try {
    // Attempt to fetch the raw JSON file
    const response = await fetch('/Data/cochrane_reviews.json');

    // If request fails, fallback to mock data
    if (!response.ok) {
      console.error('Failed to fetch reviews data:', response.status);
      return fallbackToMockData();
    }

    // Read the full raw text of the file (instead of .json() directly)
    const rawText = await response.text();
    console.log('Raw data size:', rawText.length, 'bytes');
    console.log('First 100 characters:', rawText.substring(0, 100)); // Debugging preview

    // Parse raw text into JSON
    let jsonData;
    try {
      jsonData = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return fallbackToMockData(); // Catch if malformed JSON
    }

    // Print structure info for debugging
    console.log('Data type:', typeof jsonData);
    console.log('Is array:', Array.isArray(jsonData));

    // Proceed only if parsed data is an array
    if (Array.isArray(jsonData)) {
      console.log('Array length:', jsonData.length);

      // Examine a few top-level items to determine structure
      for (let i = 0; i < Math.min(3, jsonData.length); i++) {
        console.log(`Item ${i} type:`, typeof jsonData[i]);
        console.log(`Item ${i} is array:`, Array.isArray(jsonData[i]));

        // If item is a nested array, log one sample inside it
        if (Array.isArray(jsonData[i])) {
          console.log(`Item ${i} length:`, jsonData[i].length);
          if (jsonData[i].length > 0) {
            console.log(`Sample from nested array ${i}:`, jsonData[i][0]);
          }
        } else {
          console.log(`Item ${i} content:`, jsonData[i]);
        }
      }

      // Count how many total reviews exist across all nested arrays
      let totalEntries = 0;
      if (Array.isArray(jsonData[0])) {
        jsonData.forEach((arr, idx) => {
          if (Array.isArray(arr)) {
            console.log(`Array ${idx} has ${arr.length} items`);
            totalEntries += arr.length;
          }
        });
        console.log('Total entries in all nested arrays:', totalEntries);
      } else {
        totalEntries = jsonData.length;
        console.log('Array is flat with', totalEntries, 'items');
      }

      // Normalize structure: flatten if needed
      let allReviews = [];
      if (Array.isArray(jsonData[0])) {
        // Handle nested arrays manually
        jsonData.forEach(arr => {
          if (Array.isArray(arr)) {
            arr.forEach(item => {
              allReviews.push(item);
            });
          }
        });
      } else {
        // Already flat — no need to reprocess
        allReviews = jsonData;
      }

      console.log('Final processed reviews count:', allReviews.length);
      return allReviews;
    } else {
      // Unexpected structure
      console.log('Data is not an array:', jsonData);
      return jsonData;
    }
  } catch (error) {
    console.error('Error loading reviews data:', error);
    return fallbackToMockData(); // Fallback in case of fetch or parsing failure
  }
};

// Fallback function to load mock data (if real fetch fails)
const fallbackToMockData = async () => {
  try {
    console.log('Falling back to mock data');

    // Import fallback data from file
    const mockModule = await import('./mock-data.js');
    const mockData = mockModule.default;

    console.log('Mock data type:', typeof mockData);
    console.log('Mock data is array:', Array.isArray(mockData));

    // Flatten nested mock data if needed
    if (Array.isArray(mockData)) {
      console.log('Mock data length:', mockData.length);

      if (Array.isArray(mockData[0])) {
        let allMockReviews = [];
        mockData.forEach(arr => {
          if (Array.isArray(arr)) {
            arr.forEach(item => {
              allMockReviews.push(item);
            });
          }
        });
        return allMockReviews;
      }

      return mockData;
    }

    return mockData;
  } catch (error) {
    console.error('Failed to load mock data:', error);
    return []; // Return empty array as last resort
  }
};