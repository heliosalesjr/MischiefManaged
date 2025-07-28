import React, { useMemo } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import CharacterCard from '../components/CharacterCard';
import type { Character } from '../types';

interface FavoritesProps {
  onCharacterClick?: (character: Character) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onCharacterClick }) => {
  const { state } = useApp();

  // Get favorite characters
  const favoriteCharacters = useMemo(() => {
    return state.characters.filter(char => 
      state.favoriteCharacters.includes(char.id)
    );
  }, [state.characters, state.favoriteCharacters]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiHeart className="w-8 h-8 mr-3 text-red-600" />
          Your Favorite Characters
        </h1>
        <p className="mt-2 text-gray-600">
          {favoriteCharacters.length > 0 
            ? `You have ${favoriteCharacters.length} favorite character${favoriteCharacters.length === 1 ? '' : 's'}`
            : 'You haven\'t added any favorites yet'
          }
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteCharacters.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start exploring characters and click the heart icon to add them to your favorites collection.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.hash = 'characters'}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 mr-3"
            >
              Browse All Characters
            </button>
            <button
              onClick={() => window.location.hash = 'students'}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 mr-3"
            >
              Browse Students
            </button>
            <button
              onClick={() => window.location.hash = 'staff'}
              className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors duration-200"
            >
              Browse Staff
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onCharacterClick={onCharacterClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;