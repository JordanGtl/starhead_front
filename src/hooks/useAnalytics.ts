import { useEffect } from 'react';
import { apiFetch } from '@/lib/api';

type EventType = 'page_view' | 'tool_use';
type Category =
  | 'ship' | 'component' | 'news' | 'spectrum' | 'location' | 'blueprint'
  | 'tool_ccu' | 'tool_compare' | 'tool_configure' | 'tool_refine' | 'tool_craft';

function sendEvent(eventType: EventType, category: Category, entityId?: number) {
  apiFetch('/api/analytics/event', {
    method: 'POST',
    body: JSON.stringify({ eventType, category, entityId }),
  }).catch(() => {});
}

/** Track une vue de page au montage du composant. */
export function useTrackPageView(category: Category, entityId?: number) {
  useEffect(() => {
    sendEvent('page_view', category, entityId);
  }, [category, entityId]);
}

/** Track une utilisation d'outil (appel manuel). */
export function trackToolUse(category: Category) {
  sendEvent('tool_use', category);
}
