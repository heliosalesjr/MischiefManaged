import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useSearch } from '../contexts/SearchContext';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search characters and spells..." 
}) => {
  const { searchState, setQuery, setFilters, clearSearch } = useSearch();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ type: e.target.value as 'all' | 'characters' | 'spells' });
  };

  const hasActiveSearch = searchState.query || searchState.filters.house || searchState.filters.species;

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      <div className="flex gap-4 items-center">
       
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={searchState.query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          
          {hasActiveSearch && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <label htmlFor="type-filter" className="text-sm text-gray-600 whitespace-nowrap">
            Search in:
          </label>
          <select
            id="type-filter"
            value={searchState.filters.type}
            onChange={handleTypeFilterChange}
            className="text-sm border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">Everything</option>
            <option value="characters">Characters</option>
            <option value="spells">Spells</option>
          </select>
        </div>
      </div>

      {/* Search State Indicator */}
      {searchState.isSearching && (
        <div className="mt-3 text-sm text-gray-500 flex items-center justify-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
          Searching...
        </div>
      )}

      {/* Results Summary */}
      {hasActiveSearch && !searchState.isSearching && (
        <div className="mt-3 text-sm text-gray-600 text-center">
          Found {searchState.results.characters.length} character(s) and {searchState.results.spells.length} spell(s)
        </div>
      )}
    </div>
  );
};

export default SearchBar;