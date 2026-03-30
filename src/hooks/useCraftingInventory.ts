'use client';
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface SavedIngredient {
  name:     string;
  quantity: number;
  unit:     string | null;
}

export interface SavedCraft {
  id:            number;
  dataId:        number;
  blueprintId:   number;
  name:          string;
  craftTimeSec:  number | null;
  outputType:    string | null;
  quantity:      number;
  slotQualities: {
    slotKey:     string;
    slotLabel:   string;
    optionName:  string | null;
    quality:     number;
    modifiers:   { name: string | null; mod: number }[];
  }[];
  ingredients:   SavedIngredient[];
  categoryId:    number | null;
  position:      number;
  savedAt:       string;
}

export type NewCraft = Omit<SavedCraft, 'id' | 'savedAt'>;

export function useCraftingInventory() {
  const [crafts,  setCrafts]  = useState<SavedCraft[]>([]);
  const [loaded,  setLoaded]  = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<SavedCraft[]>('/api/inventory/crafts');
      setCrafts(data);
    } catch (err) {
      console.error('[useCraftingInventory] fetchAll failed:', err);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const save = useCallback(async (craft: NewCraft): Promise<SavedCraft | null> => {
    try {
      const created = await apiFetch<SavedCraft>('/api/inventory/crafts', {
        method: 'POST',
        body: JSON.stringify(craft),
      });
      setCrafts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('[useCraftingInventory] save failed:', err);
      return null;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      // apiFetch throws on 204 (no json body) so use raw fetch
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';
      const res = await fetch(`${API_URL}/api/inventory/crafts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
      setCrafts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('[useCraftingInventory] remove failed:', err);
    }
  }, []);

  const updateCraft = useCallback(async (id: number, patch: { categoryId?: number | null; position?: number }) => {
    try {
      const updated = await apiFetch<SavedCraft>(`/api/inventory/crafts/${id}`, {
        method: 'PATCH',
        body:   JSON.stringify(patch),
      });
      setCrafts(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
      console.error('[useCraftingInventory] updateCraft failed:', err);
    }
  }, []);

  const clear = useCallback(async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';
    await Promise.all(crafts.map(c =>
      fetch(`${API_URL}/api/inventory/crafts/${c.id}`, { method: 'DELETE', credentials: 'include' })
        .catch(err => console.error('[useCraftingInventory] clear item failed:', err))
    ));
    setCrafts([]);
  }, [crafts]);

  return { crafts, loaded, loading, save, remove, updateCraft, clear, refresh: fetchAll };
}
