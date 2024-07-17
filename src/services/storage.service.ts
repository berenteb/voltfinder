'use client';

import { FilterItem } from '@/types/filter.types';

export function saveFiltersToLocalStorage(filters: FilterItem[]) {
  localStorage.setItem('filters', JSON.stringify(filters));
}

export function removeFromLocalStorage() {
  localStorage.removeItem('filters');
}

export function loadFiltersFromLocalStorage(): FilterItem[] {
  const filters = localStorage.getItem('filters');
  if (filters) {
    try {
      const parsed = JSON.parse(filters);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing filters from local storage', e);
    }
  }
  return [];
}

export function getFavorites(): Set<string> {
  const favorites = localStorage.getItem('favorites');
  if (favorites) {
    try {
      return new Set(JSON.parse(favorites));
    } catch (e) {
      console.error('Error parsing favorites from local storage', e);
    }
  }
  return new Set();
}

export function markAsFavorite(id: string) {
  const favorites = getFavorites();
  favorites.add(id);
  localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
}

export function removeFromFavorites(id: string) {
  const favorites = getFavorites();
  favorites.delete(id);
  localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
}
