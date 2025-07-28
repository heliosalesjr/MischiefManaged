# The Harry Potter Mischief Managed App

A React application to explore characters and spells from the Harry Potter universe using the HP-API.

## Features

- Browse all characters, students, and staff from Hogwarts
- Search characters and spells in real-time
- View detailed character information
- Add characters to favorites
- Choose your Hogwarts house for a personalized experience
- Responsive design for mobile and desktop

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- React Icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── pages/          # Main application pages
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and API calls
└── App.tsx         # Main application component
```

## API

This project uses the [Harry Potter API](https://hp-api.onrender.com/) to fetch character and spell data.

## Key Features Explained

### Performance Optimizations
- Pagination for large character lists (20 items per page)
- Component memoization to prevent unnecessary re-renders
- API response caching

### User Experience
- House selection that personalizes the app theme
- Favorite characters system
- Real-time search with debouncing
- Responsive navigation

### Code Quality
- TypeScript for type safety
- Clean component architecture
- Separation of concerns with contexts
- Error handling and loading states

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
