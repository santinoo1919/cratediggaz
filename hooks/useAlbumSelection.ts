import { useState } from "react";
import { getSpotifyToken, getArtist } from "@/services/spotify";
import type { Album } from "@/components/RecordComp";

export function useAlbumSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSelect = async (album: Album, index: number) => {
    setSelectedId(album.id);
    setSelectedArtist({
      name: album.artists[0]?.name,
      id: album.artists[0]?.id,
      external_urls: {
        spotify: `https://open.spotify.com/artist/${album.artists[0]?.id}`,
      },
    });

    // Add delay before fetching artist details
    await delay(1000);

    // Fetch full artist details including image
    const token = await getSpotifyToken();
    if (!token) return;

    const artistId = album.artists[0]?.id;
    if (artistId) {
      try {
        const artistData = await getArtist(token, artistId);
        if (artistData) {
          setSelectedArtist((prev: any) => ({
            ...prev,
            ...artistData,
            images: artistData.images, // Ensure images are included
          }));
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    }
  };
  return {
    selectedId,
    selectedArtist,
    handleSelect,
  };
}
