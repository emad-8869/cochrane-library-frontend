# Cochrane Library Frontend (React)

This is a React-based frontend application that displays a list of medical reviews, similar to the Cochrane Library. It supports filtering reviews by topic, shows auto-suggestions while typing, and uses infinite scroll to load results.

---

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/emad-8869/cochrane-library-frontend.git
cd cochrane-library-frontend
```

### 2. Install Dependencies

Make sure you have **Node.js** installed (v16 or newer recommended), then run:

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

This will start the app on `http://localhost:3000`.

---

## 📂 Project Structure

```
public/
  └── cochrane_reviews.json        # Main data file

src/
├── App.js                         # Main logic: filtering, infinite scroll
├── App.css                        # Styling
├── SearchBox.js                   # Search and suggestions
├── ReviewCard.js                  # Displays one review
├── api.js                         # Data loading, topic extraction
├── dataLoader.js                  # Advanced data parser
├── mock-data.js                   # Fallback data
├── index.js                       # App entry point
└── index.css                      # Global base styles
```

---

## ✅ Features

- Loads review data from a JSON file
- Search box with live topic suggestions
- Filters reviews by selected topic
- Infinite scroll with smooth loading
- Clean UI with responsive design
- Fallback mock data support for offline use
