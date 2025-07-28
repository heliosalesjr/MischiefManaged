import type { Character, Spell } from '../types';

const BASE_URL = 'https://hp-api.onrender.com/api';

class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status
    );
  }
  
  const data = await response.json();
  return data;
};

export const apiService = {
  // Get all characters
  getAllCharacters: async (): Promise<Character[]> => {
    try {
      const response = await fetch(`${BASE_URL}/characters`);
      return handleResponse<Character[]>(response);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      throw error;
    }
  },

  // Get students only (filter from all characters) - exclude staff
  getStudents: async (): Promise<Character[]> => {
    try {
      const allCharacters = await apiService.getAllCharacters();
      return allCharacters.filter(char => char.hogwartsStudent && !char.hogwartsStaff);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  // Get staff only (filter from all characters) - exclude students
  getStaff: async (): Promise<Character[]> => {
    try {
      const allCharacters = await apiService.getAllCharacters();
      return allCharacters.filter(char => char.hogwartsStaff && !char.hogwartsStudent);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      throw error;
    }
  },

  // Get  spell s
  getSpells: async (): Promise<Spell[]> => {
    try {
      const response = await fetch(`${BASE_URL}/spells`);
      return handleResponse<Spell[]>(response);
    } catch (error) {
      console.error('Failed to fetch spells:', error);
      throw error;
    }
  },

  // Get character by name (for character detail page)
  getCharacterByName: async (name: string): Promise<Character | null> => {
    try {
      const characters = await apiService.getAllCharacters();
      const character = characters.find(
        char => char.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
      );
      return character || null;
    } catch (error) {
      console.error('Failed to fetch character by name:', error);
      throw error;
    }
  }
};

// Cache implementation for better performance
class ApiCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();