import { FilterItem } from '@/types/filter.types';

export function saveFiltersToLocalStorage(filters: FilterItem[]) {
  localStorage.setItem('filters', JSON.stringify(filters));
}

export function loadFiltersFromLocalStorage(): FilterItem[] {
  const filters = localStorage.getItem('filters');
  if (filters) {
    try {
      return JSON.parse(filters);
    } catch (e) {
      console.error('Error parsing filters from local storage', e);
    }
  }
  return [];
}
