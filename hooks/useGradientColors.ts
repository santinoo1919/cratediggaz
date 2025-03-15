import { useState, useEffect, useRef } from "react";
import ImageColors from "react-native-image-colors";
import { Album } from "../components/RecordComp";

export function useGradientColors(selectedId: string | null, albums: Album[]) {
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#0f172a", // slate-900
    "#1e293b", // slate-800
  ]);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const updateColors = async () => {
      if (selectedId) {
        const selectedAlbum = albums.find((album) => album.id === selectedId);
        if (selectedAlbum) {
          const imageUrl = selectedAlbum.images[0]?.url;
          try {
            const result = await ImageColors.getColors(imageUrl, {
              fallback: "#000000",
              cache: true,
              key: selectedId,
            });

            if (!isMounted.current) return;

            if (result.platform === "android") {
              setGradientColors([result.dominant, result.average]);
            } else if (result.platform === "ios") {
              setGradientColors([result.primary, result.secondary]);
            } else {
              setGradientColors([result.vibrant, result.darkVibrant]);
            }
          } catch (error) {
            console.error("Error fetching image colors:", error);
            if (isMounted.current) {
              setGradientColors(["#4facfe", "#00f2fe"]);
            }
          }
        }
      }
    };

    updateColors();

    return () => {
      isMounted.current = false;
    };
  }, [selectedId, albums]);

  return gradientColors;
}
