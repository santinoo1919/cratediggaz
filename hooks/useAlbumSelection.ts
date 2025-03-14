import { useState } from "react";
import { getSpotifyToken, getArtist } from "@/services/spotify";
import type { Album } from "@/components/RecordComp";

interface Artist {
  name: string;
  id: string;
  images?: { url: string }[];
  external_urls: { spotify: string };
  followers?: { total: number };
  genres?: string[];
}

export function useAlbumSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  const handleSelect = async (album: Album, index: number) => {
    // First, update the UI immediately
    setSelectedId(album.id);
    setSelectedArtist({
      name: album.artists[0]?.name,
      id: album.artists[0]?.id,
      external_urls: {
        spotify: `https://open.spotify.com/artist/${album.artists[0]?.id}`,
      },
    });

    // Then fetch additional data
    try {
      const token = await getSpotifyToken();
      if (!token) return;

      const artistId = album.artists[0]?.id;
      if (artistId) {
        const artistData = await getArtist(token, artistId);
        if (artistData) {
          setSelectedArtist((prev: Artist) => ({
            ...prev,
            ...artistData,
          }));
        }
      }
    } catch (error) {
      console.error("Error in handleSelect:", error);
    }
  };

  return {
    selectedId,
    selectedArtist,
    handleSelect,
  };
}
