import React, { useState, useMemo } from 'react';
import { FiZap, FiSearch } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import SpellCard from '../components/SpellCard';

const Spells: React.FC = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSpells = useMemo(() => {
    if (!searchQuery) {
      return state.spells;
    }

    const query = searchQuery.toLowerCase();
    return state.spells.filter(spell =>
      spell.name.toLowerCase().includes(query) ||
      spell.description.toLowerCase().includes(query)
    );
  }, [state.spells, searchQuery]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spells...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiZap className="w-8 h-8 mr-3 text-orange-600" />
          Magical Spells
        </h1>
        <p className="mt-2 text-gray-600">
          Explore {state.spells.length} spells from the wizarding world and learn their magical effects
        </p>
      </div>

      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spells by name or description..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>

        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredSpells.length} of {state.spells.length} spells
          </p>
        </div>
      </div>

     
      {filteredSpells.length === 0 ? (
        <div className="text-center py-12">
          <FiZap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No spells found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'Try adjusting your search terms to see more results'
              : 'No spells available at the moment'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpells.map((spell) => (
            <SpellCard
              key={spell.id}
              spell={spell}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Spells;