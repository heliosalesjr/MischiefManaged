// Character types
export interface Character {
  id: string;
  name: string;
  alternate_names: string[];
  species: string;
  gender: string;
  house: string;
  dateOfBirth: string | null;
  yearOfBirth: number | null;
  wizard: boolean;
  ancestry: string;
  eyeColour: string;
  hairColour: string;
  wand: Wand;
  patronus: string;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string;
  alternate_actors: string[];
  alive: boolean;
  image: string;
}

export interface Wand {
  wood: string;
  core: string;
  length: number | null;
}

// Spell types
export interface Spell {
  id: string;
  name: string;
  description: string;
}

// App state types
export interface AppState {
  characters: Character[];
  spells: Spell[];
  favoriteCharacters: string[];
  loading: boolean;
  error: string | null;
}

// Search types
export interface SearchState {
  query: string;
  results: SearchResults;
  isSearching: boolean;
  filters: SearchFilters;
}

export interface SearchResults {
  characters: Character[];
  spells: Spell[];
}

export interface SearchFilters {
  type: 'all' | 'characters' | 'spells';
  house: string;
  species: string;
}

// Navigation types
export type ViewType = 'home' | 'characters' | 'students' | 'staff' | 'spells' | 'favorites' | 'character-detail';

export interface NavigationState {
  currentView: ViewType;
  selectedCharacter: string | null;
}

// API types
export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// Context types
export interface AppContextType {
  state: AppState;
  addToFavorites: (characterId: string) => void;
  removeFromFavorites: (characterId: string) => void;
  isFavorite: (characterId: string) => boolean;
}

export interface SearchContextType {
  searchState: SearchState;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
}