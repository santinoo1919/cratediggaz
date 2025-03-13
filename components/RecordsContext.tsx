import React, { createContext, useContext, useState, useEffect } from "react";
import { getSpotifyToken, searchAlbums } from "../services/spotify";

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  release_date: string;
}

interface RecordsContextType {
  albums: Album[];
  loading: boolean;
  error: string | null;
  searchRecords: (query: string) => Promise<void>;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeSpotify = async () => {
      const accessToken = await getSpotifyToken();
      setToken(accessToken);
    };
    initializeSpotify();
  }, []);

  const searchRecords = async (query: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const results = await searchAlbums(token, query);
      setAlbums(results);
    } catch (err) {
      setError("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecordsContext.Provider value={{ albums, loading, error, searchRecords }}>
      {children}
    </RecordsContext.Provider>
  );
}

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
};
