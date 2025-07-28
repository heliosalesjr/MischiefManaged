import React, { useState, useEffect } from 'react';
import { FiZap } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import StatsCards from '../components/StatsCards';
import { useApp } from '../contexts/AppContext';
import type { Character } from '../types';

interface HomeProps {
  onCharacterClick?: (character: Character) => void;
  onNavigate: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onCharacterClick, onNavigate }) => {
  const { state } = useApp();
  const [selectedHouse, setSelectedHouse] = useState<string>('');

  // Load saved house preference
  useEffect(() => {
    const savedHouse = sessionStorage.getItem('selectedHouse');
    if (savedHouse) {
      setSelectedHouse(savedHouse);
      // Apply house theme to body
      document.body.className = `house-${savedHouse.toLowerCase()}`;
    }
  }, []);

  const houses = [
    { name: 'Gryffindor', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { name: 'Slytherin', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { name: 'Hufflepuff', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { name: 'Ravenclaw', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
  ];

  const handleHouseSelect = (houseName: string) => {
    setSelectedHouse(houseName);
    sessionStorage.setItem('selectedHouse', houseName);
    
    
    document.body.className = `house-${houseName.toLowerCase()}`;
    
    
    const button = document.querySelector(`[data-house="${houseName}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  const getHouseGreeting = () => {
    if (!selectedHouse) return '';
    
    const greetings = {
      'Gryffindor': '🦁 Welcome, brave Gryffindor!',
      'Slytherin': '🐍 Welcome, ambitious Slytherin!',
      'Hufflepuff': '🦡 Welcome, loyal Hufflepuff!',
      'Ravenclaw': '🦅 Welcome, wise Ravenclaw!'
    };
    
    return greetings[selectedHouse as keyof typeof greetings] || '';
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading magical data...
          </h2>
          <p className="text-gray-600">
            Fetching characters and spells from Hogwarts
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FiZap className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {state.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          The Harry Potter {' '}
          <span className="text-blue-600">Mischief Managed App</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover characters, spells, and magical creatures from the Harry Potter universe. 
          Search, explore, and build your collection of favorites.
        </p>

        {/* House Selection */}
        <div className="mt-8">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Choose Your House:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {houses.map((house) => (
              <button
                key={house.name}
                data-house={house.name}
                onClick={() => handleHouseSelect(house.name)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:scale-105 ${
                  selectedHouse === house.name
                    ? `${house.color} ${house.bgColor} ${house.borderColor} shadow-md`
                    : 'text-gray-600 bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                {house.name}
              </button>
            ))}
          </div>
          
          {/* House Greeting */}
          {selectedHouse && (
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
              <p className="text-lg font-medium text-gray-800">
                {getHouseGreeting()}
              </p>
            </div>
          )}
        </div>
      </div>

      
      <StatsCards onNavigate={onNavigate} />

      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Search Characters & Spells
          </h2>
          <p className="text-gray-600">
            Find your favorite characters and discover new spells in real-time
            {selectedHouse && (
              <span className="block mt-1 text-sm text-gray-500">
                ✨ Showing results with {selectedHouse} pride
              </span>
            )}
          </p>
        </div>
        
        <SearchBar />
        <SearchResults onCharacterClick={onCharacterClick} />
      </div>
    </div>
  );
};

export default Home;