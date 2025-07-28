import type { Character, Spell, SearchResults, SearchFilters } from '../types';

// Normalize string for comparison (remove accents, lowercase, etc.)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Search characters 
export const searchCharacters = (
  characters: Character[],
  query: string,
  filters: SearchFilters
): Character[] => {
  if (!query && !filters.house && !filters.species) {
    return characters;
  }

  const normalizedQuery = normalizeString(query);

  return characters.filter(character => {
    // Text search
    const matchesQuery = !query || (
      normalizeString(character.name).includes(normalizedQuery) ||
      normalizeString(character.actor).includes(normalizedQuery) ||
      character.alternate_names.some(name => 
        normalizeString(name).includes(normalizedQuery)
      ) ||
      normalizeString(character.house).includes(normalizedQuery) ||
      normalizeString(character.species).includes(normalizedQuery)
    );

    

    return matchesQuery;
  });
};

// Search spells
export const searchSpells = (
  spells: Spell[],
  query: string
): Spell[] => {
  if (!query) {
    return spells;
  }

  const normalizedQuery = normalizeString(query);

  return spells.filter(spell => 
    normalizeString(spell.name).includes(normalizedQuery) ||
    normalizeString(spell.description).includes(normalizedQuery)
  );
};

// Combined search function
export const performSearch = (
  characters: Character[],
  spells: Spell[],
  query: string,
  filters: SearchFilters
): SearchResults => {
  const searchResults: SearchResults = {
    characters: [],
    spells: []
  };

  if (filters.type === 'all' || filters.type === 'characters') {
    searchResults.characters = searchCharacters(characters, query, filters);
  }

  if (filters.type === 'all' || filters.type === 'spells') {
    searchResults.spells = searchSpells(spells, query);
  }

  return searchResults;
};



// Convert character name to URL slug
export const createCharacterSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Convert URL slug back to character name for lookup
export const parseCharacterSlug = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};