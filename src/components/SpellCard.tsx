import React from 'react';
import { FiZap } from 'react-icons/fi';
import type { Spell } from '../types';

interface SpellCardProps {
  spell: Spell;
  compact?: boolean;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell, compact = false }) => {
  const cardClasses = compact
    ? "bg-white rounded-lg shadow-sm border border-gray-200 p-3"
    : "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200";

  return (
    <div className={cardClasses}>
      
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <FiZap className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {spell.name}
          </h3>
        </div>
      </div>

      {/* Spell Description */}
      <div className="text-sm text-gray-600 leading-relaxed">
        <p className={compact ? "line-clamp-2" : "line-clamp-3"}>
          {spell.description}
        </p>
      </div>

      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <FiZap className="w-3 h-3 mr-1" />
          Spell
        </span>
      </div>
    </div>
  );
};

export default SpellCard;