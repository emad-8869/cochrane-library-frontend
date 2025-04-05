// src/mock-data.js
// This file contains mock data for fallback or testing when real data is unavailable

// Initial static reviews manually added (realistic samples)
const mockReviews = [
  {
    "URL": "http://onlinelibrary.wiley.com/doi/10.1002/14651858.CD002204.pub4/full",
    "Topic": "Allergy & intolerance",
    "Title": "Antifungal therapies for allergic bronchopulmonary aspergillosis in people with cystic fibrosis",
    "Author": "Heather E Elphick, Kevin W Southern",
    "Date": "2016-11-08"
  },
  {
    "URL": "http://onlinelibrary.wiley.com/doi/10.1002/14651858.CD010112.pub2/full",
    "Topic": "Allergy & intolerance",
    "Title": "Polyunsaturated fatty acid supplementation in infancy for the prevention of allergy",
    "Author": "Tim Schindler, John KH Sinn, David A Osborn",
    "Date": "2016-10-28"
  },
  // More manually entered items can go here if needed
];

// Dynamically add 35+ generated reviews for testing infinite scroll and filtering
for (let i = 1; i <= 35; i++) {
  // Assign topics based on index for variety
  const topic = i % 5 === 0 ? "Neurology" : 
               i % 4 === 0 ? "Cardiovascular" : 
               i % 3 === 0 ? "Respiratory medicine" :
               i % 2 === 0 ? "Infectious disease" : "Oncology";

  // Assign titles aligned with the topics
  const title = i % 5 === 0 ? "Neural pathways in degenerative diseases" : 
                i % 4 === 0 ? "Cardioprotective effects of natural compounds" : 
                i % 3 === 0 ? "Interventions for chronic respiratory conditions" :
                i % 2 === 0 ? "Antimicrobial resistance patterns" : 
                "Cancer therapy outcomes";

  // Add each generated review to the list
  mockReviews.push({
    "URL": `http://onlinelibrary.wiley.com/doi/10.1002/14651858.CD0${10000 + i}/full`,
    "Topic": topic,
    "Title": title,
    "Author": i % 5 === 0 ? "James B Wilson, Sophia Chen, Robert Miller" : 
              i % 4 === 0 ? "Maria Garcia, John Smith, Emily Taylor" : 
              i % 3 === 0 ? "David Johnson, Lisa Brown, Michael Davis" :
              i % 2 === 0 ? "Sarah Martinez, Christopher Lee, Jennifer White" : 
              "Thomas Anderson, Elizabeth Wright, Daniel Thompson",
    "Date": `${2020 + (i % 5)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
  });
}

// Export the mock reviews so they can be imported as fallback data
export default mockReviews;