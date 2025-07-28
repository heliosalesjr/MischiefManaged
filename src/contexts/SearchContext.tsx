import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { SearchState, SearchContextType, SearchFilters } from '../types';
import { useApp } from './AppContext';
import { useDebounce } from '../hooks/useDebounce';
import { performSearch } from '../utils/search';

// Initial state
const initialState: SearchState = {
  query: '',
  results: {
    characters: [],
    spells: []
  },
  isSearching: false,
  filters: {
    type: 'all',
    house: '',
    species: ''
  }
};

// Action types
type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: SearchState['results'] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'CLEAR_SEARCH' };

// Reducer function
const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    
    case 'SET_RESULTS':
      return { ...state, results: action.payload, isSearching: false };
    
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'CLEAR_SEARCH':
      return {
        ...initialState,
        filters: state.filters // Keep filters when clearing search
      };
    
    default:
      return state;
  }
};

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchState, dispatch] = useReducer(searchReducer, initialState);
  const { state: appState } = useApp();
  
  // Debounce the search query to avoid excessive API calls/filtering
  const debouncedQuery = useDebounce(searchState.query, 300);

  // Perform search when query or filters change
  useEffect(() => {
    if (!appState.characters.length && !appState.spells.length) {
      return; // Wait for data to load
    }

    // If there's no query and no active filters, show empty results
    if (!debouncedQuery && !searchState.filters.house && !searchState.filters.species) {
      dispatch({ 
        type: 'SET_RESULTS', 
        payload: { characters: [], spells: [] }
      });
      return;
    }

    dispatch({ type: 'SET_SEARCHING', payload: true });

    // Perform the search
    const results = performSearch(
      appState.characters,
      appState.spells,
      debouncedQuery,
      searchState.filters
    );

    dispatch({ type: 'SET_RESULTS', payload: results });
  }, [debouncedQuery, searchState.filters, appState.characters, appState.spells]);

  // Context methods
  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  };

  const setFilters = (filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const contextValue: SearchContextType = {
    searchState,
    setQuery,
    setFilters,
    clearSearch
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};