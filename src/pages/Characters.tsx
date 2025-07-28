import React, { useState, useMemo, useCallback } from 'react';
import { FiUsers, FiSearch, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import CharacterCard from '../components/CharacterCard';
import type { Character } from '../types';

interface CharactersProps {
  onCharacterClick?: (character: Character) => void;
}

const ITEMS_PER_PAGE = 20;

const Characters: React.FC<CharactersProps> = ({ onCharacterClick }) => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Memoize the filtered characters to avoid recalculation
  const filteredCharacters = useMemo(() => {
    if (!searchQuery) {
      return state.characters;
    }

    const query = searchQuery.toLowerCase();
    return state.characters.filter(character =>
      character.name.toLowerCase().includes(query) ||
      character.actor.toLowerCase().includes(query) ||
      character.house.toLowerCase().includes(query) ||
      character.species.toLowerCase().includes(query)
    );
  }, [state.characters, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCharacters = filteredCharacters.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Memoize handlers to prevent re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleGridMode = useCallback(() => {
    setViewMode('grid');
  }, []);

  const handleListMode = useCallback(() => {
    setViewMode('list');
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading characters...</p>
        </div>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiUsers className="w-8 h-8 mr-3 text-blue-600" />
            All Characters
          </h1>
          <p className="mt-2 text-gray-600">
            Explore all {state.characters.length} characters from the Harry Potter universe
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={handleGridMode}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={handleListMode}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Simple Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search characters by name, actor, house, or species..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Results count and pagination info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCharacters.length)} of {filteredCharacters.length} characters
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Characters Grid/List */}
      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No characters found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {currentCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onCharacterClick={onCharacterClick}
                compact={viewMode === 'list'}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageClick(page as number)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Characters;