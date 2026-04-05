'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export interface FleetShipDef {
  id:            number;
  name:          string;
  manufacturer:  string | null;
  movementClass: string | null;
  image:         string | null;
}

export interface FleetEntry {
  id:         number;
  customName: string | null;
  notes:      string | null;
  createdAt:  string;
  shipDef:    FleetShipDef | null;
}

export function useUserFleet() {
  const [fleet,   setFleet]   = useState<FleetEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<FleetEntry[]>('/api/me/fleet');
      setFleet(data);
    } catch {
      setFleet([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const add = async (payload: { shipDefId?: number; customName?: string; notes?: string }): Promise<FleetEntry> => {
    const data = await apiFetch<FleetEntry>('/api/me/fleet', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    setFleet(prev => [data, ...prev]);
    return data;
  };

  const remove = async (id: number): Promise<void> => {
    await apiFetch(`/api/me/fleet/${id}`, { method: 'DELETE' });
    setFleet(prev => prev.filter(e => e.id !== id));
  };

  return { fleet, loading, add, remove, refetch };
}
