import React, { useState, useMemo } from 'react';
import { FiStar, FiSearch } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import CharacterCard from '../components/CharacterCard';
import type { Character } from '../types';

interface StaffProps {
  onCharacterClick?: (character: Character) => void;
}

const Staff: React.FC<StaffProps> = ({ onCharacterClick }) => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter only staff -- exclude those who are also students
  const staff = useMemo(() => {
    return state.characters.filter(char => char.hogwartsStaff && !char.hogwartsStudent);
  }, [state.characters]);

  const filteredStaff = useMemo(() => {
    if (!searchQuery) {
      return staff;
    }

    const query = searchQuery.toLowerCase();
    return staff.filter(staffMember =>
      staffMember.name.toLowerCase().includes(query) ||
      staffMember.actor.toLowerCase().includes(query) ||
      staffMember.house.toLowerCase().includes(query)
    );
  }, [staff, searchQuery]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
<div className="space-y-6">
  {/* Header */}
  <div>
    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
      <FiStar className="w-8 h-8 mr-3 text-purple-600" />
      Hogwarts Staff
    </h1>
    <p className="mt-2 text-gray-600">
      Meet all {staff.length} teachers and staff members of Hogwarts School of Witchcraft and Wizardry
    </p>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, actor, or house..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>

        {/* Results count */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredStaff.length} of {staff.length} staff members
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <FiStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No staff members found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staffMember) => (
            <CharacterCard
              key={staffMember.id}
              character={staffMember}
              onCharacterClick={onCharacterClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Staff;