import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AppState, AppContextType, Character, Spell } from '../types';
import { apiService } from '../utils/api';

// Initial state
const initialState: AppState = {
  characters: [],
  spells: [],
  favoriteCharacters: [],
  loading: false,
  error: null
};

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHARACTERS'; payload: Character[] }
  | { type: 'SET_SPELLS'; payload: Spell[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: string[] };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    
    case 'SET_SPELLS':
      return { ...state, spells: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'ADD_FAVORITE':
      { if (state.favoriteCharacters.includes(action.payload)) {
        return state;
      }
      const newFavorites = [...state.favoriteCharacters, action.payload];
      // Note: In production, you would save to localStorage here
      return { ...state, favoriteCharacters: newFavorites }; }
    
    case 'REMOVE_FAVORITE':
      { const filteredFavorites = state.favoriteCharacters.filter(id => id !== action.payload);
      // Note: In production, you would save to localStorage here
      return { ...state, favoriteCharacters: filteredFavorites }; }
    
    case 'LOAD_FAVORITES':
      return { ...state, favoriteCharacters: action.payload };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);



  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        // Load characters and spells in parallel
        const [characters, spells] = await Promise.all([
          apiService.getAllCharacters(),
          apiService.getSpells()
        ]);

        dispatch({ type: 'SET_CHARACTERS', payload: characters });
        dispatch({ type: 'SET_SPELLS', payload: spells });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Context methods - memoized to prevent re-renders
  const addToFavorites = useCallback((characterId: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: characterId });
  }, []);

  const removeFromFavorites = useCallback((characterId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: characterId });
  }, []);

  const isFavorite = useCallback((characterId: string): boolean => {
    return state.favoriteCharacters.includes(characterId);
  }, [state.favoriteCharacters]);

  const contextValue: AppContextType = {
    state,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};