import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppProvider } from './contexts/AppContext';
import { SearchProvider } from './contexts/SearchContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Students from './pages/Students';
import Staff from './pages/Staff';
import Spells from './pages/Spells';
import Favorites from './pages/Favorites';
import CharacterDetail from './pages/CharacterDetail';
import type { Character, ViewType } from './types';
import { createCharacterSlug } from './utils/search';
import { useApp } from './contexts/AppContext';

// Router component that handles URL changes
const AppRouter: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCharacterSlug, setSelectedCharacterSlug] = useState<string | null>(null);
  const { state } = useApp();

  // Parse URL on mount and when hash changes
  useEffect(() => {
    const parseURL = () => {
      const hash = window.location.hash.slice(1); // Remove #
      
      if (!hash) {
        setCurrentView('home');
        setSelectedCharacterSlug(null);
        return;
      }

      const parts = hash.split('/');
      const view = parts[0] as ViewType;

      if (view === 'characters' && parts.length === 2) {
        setCurrentView('character-detail');
        setSelectedCharacterSlug(parts[1]);
      } else if (['home', 'characters', 'students', 'staff', 'spells', 'favorites'].includes(view)) {
        setCurrentView(view);
        setSelectedCharacterSlug(null);
      } else {
        setCurrentView('home');
        setSelectedCharacterSlug(null);
      }
    };

    parseURL();
    
    const handleHashChange = () => {
      parseURL();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation handler - memoized to prevent re-renders
  const handleNavigate = useCallback((view: string, characterSlug?: string) => {
    if (view === 'character-detail' && characterSlug) {
      window.location.hash = `characters/${characterSlug}`;
    } else {
      window.location.hash = view === 'home' ? '' : view;
    }
  }, []);

  // Character click handler - memoized to prevent re-renders
  const handleCharacterClick = useCallback((character: Character) => {
    const slug = createCharacterSlug(character.name);
    handleNavigate('character-detail', slug);
  }, [handleNavigate]);

  // Back handler for character detail - memoized to prevent re-renders
  const handleBack = useCallback(() => {
    handleNavigate('characters');
  }, [handleNavigate]);

  // Find selected character for detail view - memoized for performance
  const selectedCharacter = useMemo(() => {
    if (!selectedCharacterSlug || !state.characters.length) return null;
    
    return state.characters.find(char => 
      createCharacterSlug(char.name) === selectedCharacterSlug
    ) || null;
  }, [selectedCharacterSlug, state.characters]);

  // Render current view - memoized to prevent unnecessary re-renders
  const currentViewComponent = useMemo(() => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            onCharacterClick={handleCharacterClick}
            onNavigate={handleNavigate}
          />
        );
      
      case 'characters':
        return (
          <Characters onCharacterClick={handleCharacterClick} />
        );
      
      case 'students':
        return (
          <Students onCharacterClick={handleCharacterClick} />
        );
      
      case 'staff':
        return (
          <Staff onCharacterClick={handleCharacterClick} />
        );
      
      case 'spells':
        return <Spells />;
      
      case 'favorites':
        return (
          <Favorites onCharacterClick={handleCharacterClick} />
        );
      
      case 'character-detail':
        if (!selectedCharacter) {
          return (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Character Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The character you're looking for doesn't exist.
              </p>
              <button
                onClick={() => handleNavigate('characters')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Browse Characters
              </button>
            </div>
          );
        }
        
        return (
          <CharacterDetail 
            character={selectedCharacter}
            onBack={handleBack}
          />
        );
      
      default:
        return (
          <Home 
            onCharacterClick={handleCharacterClick}
            onNavigate={handleNavigate}
          />
        );
    }
  }, [currentView, selectedCharacter, handleCharacterClick, handleNavigate, handleBack]);

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {currentViewComponent}
    </Layout>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <AppProvider>
      <SearchProvider>
        <AppRouter />
      </SearchProvider>
    </AppProvider>
  );
};

export default App;