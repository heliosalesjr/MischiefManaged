import React from 'react';
import { FiUsers, FiBookOpen } from 'react-icons/fi';
import { useSearch } from '../contexts/SearchContext';
import CharacterCard from './CharacterCard';
import SpellCard from './SpellCard';
import type { Character } from '../types';

interface SearchResultsProps {
  onCharacterClick?: (character: Character) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onCharacterClick }) => {
  const { searchState } = useSearch();
  const { results, query, filters } = searchState;

  // Don't show results if there's no active search
  const hasActiveSearch = query || filters.house || filters.species;
  if (!hasActiveSearch) {
    return null;
  }

  const hasResults = results.characters.length > 0 || results.spells.length > 0;

  return (
    <div className="mt-8">
      {!hasResults ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiUsers className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Characters Results */}
          {results.characters.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <FiUsers className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Characters ({results.characters.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.characters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onCharacterClick={onCharacterClick}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Spells Results */}
          {results.spells.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <FiBookOpen className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Spells ({results.spells.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.spells.map((spell) => (
                  <SpellCard
                    key={spell.id}
                    spell={spell}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;