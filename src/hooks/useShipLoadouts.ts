'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export interface SavedShipLoadout {
  id:       number;
  name:     string;
  slots:    Record<string, number | null>;
  savedAt:  string;
  shipDef:  {
    id:           number;
    internalName: string;
    image:        string | null;
  };
}

export function useShipLoadouts(shipDefId?: number | null) {
  const [loadouts, setLoadouts] = useState<SavedShipLoadout[]>([]);
  const [loading,  setLoading]  = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const qs = shipDefId != null ? `?shipDefId=${shipDefId}` : '';
      const data = await apiFetch<SavedShipLoadout[]>(`/api/me/loadouts${qs}`);
      setLoadouts(data);
    } catch {
      setLoadouts([]);
    } finally {
      setLoading(false);
    }
  }, [shipDefId]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (name: string, slots: Record<string, number | null>, defId: number): Promise<SavedShipLoadout> => {
    const data = await apiFetch<SavedShipLoadout>('/api/me/loadouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipDefId: defId, name, slots }),
    });
    setLoadouts(prev => [data, ...prev]);
    return data;
  };

  const rename = async (id: number, name: string): Promise<void> => {
    const data = await apiFetch<SavedShipLoadout>(`/api/me/loadouts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setLoadouts(prev => prev.map(l => l.id === id ? data : l));
  };

  const remove = async (id: number): Promise<void> => {
    await apiFetch(`/api/me/loadouts/${id}`, { method: 'DELETE' });
    setLoadouts(prev => prev.filter(l => l.id !== id));
  };

  return { loadouts, loading, save, rename, remove, refetch: fetch };
}
