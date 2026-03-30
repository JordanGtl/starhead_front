'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export interface CraftCategory {
  id:        number;
  name:      string;
  position:  number;
  isDefault: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export function useCraftCategories() {
  const [categories, setCategories] = useState<CraftCategory[]>([]);
  const [loaded,     setLoaded]     = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const data = await apiFetch<CraftCategory[]>('/api/inventory/categories');
      setCategories(data.sort((a, b) => a.position - b.position || a.id - b.id));
    } catch (err) {
      console.error('[useCraftCategories] fetchAll failed:', err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (name: string): Promise<CraftCategory> => {
    const cat = await apiFetch<CraftCategory>('/api/inventory/categories', {
      method: 'POST',
      body:   JSON.stringify({ name }),
    });
    setCategories(prev => [...prev, cat].sort((a, b) => a.position - b.position || a.id - b.id));
    return cat;
  }, []);

  const rename = useCallback(async (id: number, name: string) => {
    try {
      const updated = await apiFetch<CraftCategory>(`/api/inventory/categories/${id}`, {
        method: 'PATCH',
        body:   JSON.stringify({ name }),
      });
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
      console.error('[useCraftCategories] rename failed:', err);
    }
  }, []);

  const reorder = useCallback(async (ordered: CraftCategory[]) => {
    setCategories(ordered);
    try {
      await apiFetch('/api/inventory/categories/reorder', {
        method: 'POST',
        body:   JSON.stringify({ ids: ordered.map(c => c.id) }),
      });
    } catch (err) {
      console.error('[useCraftCategories] reorder failed:', err);
    }
  }, []);

  const setDefault = useCallback(async (id: number) => {
    try {
      const updated = await apiFetch<CraftCategory>(`/api/inventory/categories/${id}/default`, {
        method: 'POST',
      });
      setCategories(prev => prev.map(c => ({ ...c, isDefault: c.id === id ? updated.isDefault : false })));
    } catch (err) {
      console.error('[useCraftCategories] setDefault failed:', err);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await fetch(`${API_URL}/api/inventory/categories/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('[useCraftCategories] remove failed:', err);
    }
  }, []);

  return { categories, loaded, create, rename, reorder, setDefault, remove };
}
