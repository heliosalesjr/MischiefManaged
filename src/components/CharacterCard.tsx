import React, { memo } from 'react';
import { FiHeart, FiHome, FiStar } from 'react-icons/fi';
import type { Character } from '../types';
import { useApp } from '../contexts/AppContext';

interface CharacterCardProps {
  character: Character;
  onCharacterClick?: (character: Character) => void;
  compact?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = memo(({ 
  character, 
  onCharacterClick,
  compact = false 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useApp();
  const isCharacterFavorite = isFavorite(character.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCharacterFavorite) {
      removeFromFavorites(character.id);
    } else {
      addToFavorites(character.id);
    }
  };

  const handleCardClick = () => {
    if (onCharacterClick) {
      onCharacterClick(character);
    }
  };

  const getHouseColor = (house: string): string => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'slytherin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hufflepuff':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ravenclaw':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const cardClasses = compact 
    ? "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    : "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer";

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      {/* Character Image - Circular at top (only if image exists and not compact) */}
      {!compact && character.image && (
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-gray-200 shadow-sm">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Hide the entire image container when image fails
                const container = target.parentElement;
                if (container) {
                  container.style.display = 'none';
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="text-center">
        {/* Header with name and favorite button */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 text-left">
            {character.name}
          </h3>
          <button
            onClick={handleFavoriteClick}
            className={`ml-2 p-1 rounded-full transition-colors duration-200 flex-shrink-0 ${
              isCharacterFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={isCharacterFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart 
              className="w-5 h-5" 
              fill={isCharacterFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Character Info */}
        <div className="space-y-2 text-left">
          {/* House */}
          {character.house && (
            <div className="flex items-center space-x-2">
              <FiHome className="w-4 h-4 text-gray-500" />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHouseColor(character.house)}`}>
                {character.house}
              </span>
            </div>
          )}

          {/* Species */}
          {character.species && (
            <div className="flex items-center space-x-2">
              <FiStar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">
                {character.species}
              </span>
            </div>
          )}

          {/* Actor */}
          {character.actor && (
            <div className="text-sm text-gray-500">
              Played by {character.actor}
            </div>
          )}

          {/* Status indicators */}
          <div className="flex flex-wrap gap-1 mt-2">
            {character.hogwartsStudent && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Student
              </span>
            )}
            {character.hogwartsStaff && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                Staff
              </span>
            )}
            {!character.alive && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Deceased
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.character.id === nextProps.character.id &&
    prevProps.compact === nextProps.compact &&
    prevProps.onCharacterClick === nextProps.onCharacterClick
  );
});

CharacterCard.displayName = 'CharacterCard';

export default CharacterCard;