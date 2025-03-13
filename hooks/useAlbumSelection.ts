import { useState, useEffect } from "react";
import { getSpotifyToken, getArtist, getAlbumTracks } from "@/services/spotify";
import type { Album } from "@/components/RecordComp";

export function useAlbumSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  const handleSelect = async (album: Album, index: number) => {
    setSelectedId(album.id);

    try {
      const token = await getSpotifyToken();
      if (!token) return;

      // Get artist info
      const artistId = album.artists[0]?.id;
      if (artistId) {
        const artistData = await getArtist(token, artistId);
        setSelectedArtist(artistData);
      }

      // Get tracks and try to play first available preview
      const tracksData = await getAlbumTracks(token, album.id);
      const trackWithPreview = tracksData.items.find(
        (track: { preview_url: string | null }) => track.preview_url
      );

      if (trackWithPreview?.preview_url) {
        // Sound-related code removed
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
