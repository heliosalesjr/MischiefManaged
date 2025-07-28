import React from 'react';
import { FiUsers, FiBookOpen, FiZap, FiHeart } from 'react-icons/fi';
import { FaMagic } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

interface StatsCardsProps {
  onNavigate: (view: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ onNavigate }) => {
  const { state } = useApp();

  const stats = [
    {
      id: 'characters',
      name: 'All Characters',
      value: state.characters.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      onClick: () => onNavigate('characters')
    },
    {
      id: 'students',
      name: 'Students',
      value: state.characters.filter(c => c.hogwartsStudent && !c.hogwartsStaff).length,
      icon: FiBookOpen,
      color: 'bg-green-500',
      onClick: () => onNavigate('students')
    },
    {
      id: 'staff',
      name: 'Staff',
      value: state.characters.filter(c => c.hogwartsStaff && !c.hogwartsStudent).length,
      icon: FaMagic,
      color: 'bg-purple-500',
      onClick: () => onNavigate('staff')
    },
    {
      id: 'spells',
      name: 'Spells',
      value: state.spells.length,
      icon: FiZap,
      color: 'bg-orange-500',
      onClick: () => onNavigate('spells')
    },
    {
      id: 'favorites',
      name: 'Favorites',
      value: state.favoriteCharacters.length,
      icon: FiHeart,
      color: 'bg-red-500',
      onClick: () => onNavigate('favorites')
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={stat.onClick}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </div>
            <div className="ml-16 pb-6 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;