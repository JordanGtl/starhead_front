import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export interface GameVersion {
  id: number;
  label: string;
  isLive: boolean;
  releasedAt: string | null;
  notes: string | null;
}

interface VersionContextType {
  versions: GameVersion[];
  selectedVersion: GameVersion | null;
  setSelectedVersion: (v: GameVersion) => void;
  loading: boolean;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

const LS_KEY = "sh_game_version";

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [versions, setVersions]               = useState<GameVersion[]>([]);
  const [selectedVersion, setSelected]        = useState<GameVersion | null>(null);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    apiFetch<GameVersion[]>("/api/game-versions")
      .then((data) => {
        setVersions(data);

        // Restaure depuis localStorage, sinon prend la version live, sinon la première
        const storedId = localStorage.getItem(LS_KEY);
        const restored = storedId ? data.find((v) => String(v.id) === storedId) : null;
        const live      = data.find((v) => v.isLive);
        setSelected(restored ?? live ?? data[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setSelectedVersion = (v: GameVersion) => {
    setSelected(v);
    localStorage.setItem(LS_KEY, String(v.id));
  };

  return (
    <VersionContext.Provider value={{ versions, selectedVersion, setSelectedVersion, loading }}>
      {children}
    </VersionContext.Provider>
  );
};

export function useVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("useVersion must be used inside VersionProvider");
  return ctx;
}
