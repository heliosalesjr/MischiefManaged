import React from 'react';
import { FiArrowLeft, FiHeart, FiHome, FiUser, FiStar, FiCalendar, FiEye } from 'react-icons/fi';
import type { Character } from '../types';
import { useApp } from '../contexts/AppContext';

interface CharacterDetailProps {
  character: Character;
  onBack: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, onBack }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useApp();
  const isCharacterFavorite = isFavorite(character.id);

  const handleFavoriteClick = () => {
    if (isCharacterFavorite) {
      removeFromFavorites(character.id);
    } else {
      addToFavorites(character.id);
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to characters</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
       
        <div className="p-8 text-center">
       
          {character.image && (
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      container.style.display = 'none';
                    }
                  }}
                />
              </div>
            </div>
          )}

          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {character.name}
            </h1>
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isCharacterFavorite
                  ? 'text-red-500 hover:text-red-600 bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label={isCharacterFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart 
                className="w-6 h-6" 
                fill={isCharacterFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          
          
          {character.alternate_names.length > 0 && (
            <p className="text-gray-600 mb-6 text-lg">
              Also known as: {character.alternate_names.join(', ')}
            </p>
          )}

          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {character.house && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getHouseColor(character.house)}`}>
                <FiHome className="w-4 h-4 mr-1" />
                {character.house}
              </span>
            )}
            
            {character.hogwartsStudent && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Student
              </span>
            )}
            
            {character.hogwartsStaff && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Staff
              </span>
            )}
            
            {!character.alive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Deceased
              </span>
            )}
          </div>
        </div>

        {/* Character Details */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              
              <div className="space-y-4">
                {character.species && (
                  <div className="flex items-center space-x-3">
                    <FiStar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Species:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {character.species}
                      </span>
                    </div>
                  </div>
                )}

                {character.gender && (
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.gender}
                      </span>
                    </div>
                  </div>
                )}

                {(character.dateOfBirth || character.yearOfBirth) && (
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Born:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.dateOfBirth || character.yearOfBirth}
                      </span>
                    </div>
                  </div>
                )}

                {character.ancestry && (
                  <div className="flex items-center space-x-3">
                    <FiStar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Blood Status:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.ancestry}
                      </span>
                    </div>
                  </div>
                )}

                {character.patronus && (
                  <div className="flex items-center space-x-3">
                    <FiStar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Patronus:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.patronus}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Additional Details
              </h2>
              
              <div className="space-y-4">
                {character.eyeColour && (
                  <div className="flex items-center space-x-3">
                    <FiEye className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Eye Color:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.eyeColour}
                      </span>
                    </div>
                  </div>
                )}

                {character.hairColour && (
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Hair Color:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.hairColour}
                      </span>
                    </div>
                  </div>
                )}

                {character.actor && (
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Portrayed by:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.actor}
                      </span>
                    </div>
                  </div>
                )}

                {character.alternate_actors.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Also portrayed by:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {character.alternate_actors.join(', ')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <FiStar className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">Wizard:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {character.wizard ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;