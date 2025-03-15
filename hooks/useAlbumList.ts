import { useState, useEffect, useRef } from "react";
import { searchAlbums } from "@/services/spotify";
import { Album } from "../components/RecordComp";
import { useAlbumSelection } from "./useAlbumSelection";
import { FlashList } from "@shopify/flash-list";

export function useAlbumList(genre: "funk" | "soul" = "funk") {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { selectedId, selectedArtist, handleSelect } = useAlbumSelection();
  const listRef = useRef<FlashList<Album>>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    async function fetchAlbums() {
      try {
        console.log(`Fetching popular ${genre} albums from 1972-1982...`);
        const results = await searchAlbums(`${genre} year:1972-1982`);
        if (isMounted.current) {
          const sortedResults = results.sort(
            (a: Album, b: Album) => b.popularity - a.popularity
          );
          setAlbums(sortedResults);
          if (sortedResults[0]) {
            handleSelectAndScroll(sortedResults[0], 0);
          }
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }

    fetchAlbums();

    return () => {
      isMounted.current = false;
    };
  }, [genre]); // Add genre to dependencies

  const handleSelectAndScroll = (album: Album, index: number) => {
    handleSelect(album, index);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return {
    albums,
    selectedId,
    selectedArtist,
    handleSelectAndScroll,
    listRef,
  };
}
