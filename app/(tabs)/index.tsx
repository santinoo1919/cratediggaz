import { View, Text, Pressable, Linking, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordComp from "@/components/RecordComp";
import { useEffect, useState, useRef, useCallback } from "react";
import { searchAlbums } from "@/services/spotify";
import { FlashList } from "@shopify/flash-list";
import { Album } from "@/components/RecordComp";
import { Image } from "react-native";
import { useAlbumSelection } from "@/hooks/useAlbumSelection";
import { LinearGradient } from "expo-linear-gradient";
import ImageColors from "react-native-image-colors";
import { MotiView } from "moti";
import { usePathname } from "expo-router";
import AlbumDetails from "@/components/AlbumDetails";

export default function HomeScreen() {
  const pathname = usePathname();
  const [albums, setAlbums] = useState<Album[]>([]);
  const listRef = useRef<FlashList<Album>>(null);
  const { selectedId, selectedArtist, handleSelect } = useAlbumSelection();
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#0f172a", // slate-900
    "#1e293b", // slate-800
  ]);

  useEffect(() => {
    if (selectedId) {
      const selectedAlbum = albums.find((album) => album.id === selectedId);
      if (selectedAlbum) {
        const imageUrl = selectedAlbum.images[0]?.url;
        console.log("Image URL:", imageUrl); // Log the image URL

        ImageColors.getColors(imageUrl, {
          fallback: "#000000",
          cache: true,
          key: selectedId,
        })
          .then((result) => {
            console.log("Color extraction result:", result); // Log the result
            if (result.platform === "android") {
              setGradientColors([result.dominant, result.average]);
            } else if (result.platform === "ios") {
              setGradientColors([result.primary, result.secondary]);
            } else {
              // Handle web case
              setGradientColors([result.vibrant, result.darkVibrant]); // Use vibrant colors for web
            }
          })
          .catch((error) => {
            console.error("Error fetching image colors:", error);
            setGradientColors(["#4facfe", "#00f2fe"]); // Fallback colors on error
          });
      }
    }
  }, [selectedId, albums]);

  // Add this function to handle scrolling
  const handleSelectAndScroll = (album: Album, index: number) => {
    handleSelect(album, index);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // This centers the selected item
    });
  };

  useEffect(() => {
    async function fetchAlbums() {
      try {
        console.log("Fetching popular funk albums from 1972-1982...");
        const results = await searchAlbums("funk year:1972-1982");
        // Sort by popularity (highest first)
        const sortedResults = results.sort(
          (a: Album, b: Album) => b.popularity - a.popularity
        );
        setAlbums(sortedResults);
        if (sortedResults[0]) {
          handleSelectAndScroll(sortedResults[0] as Album, 0);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }

    fetchAlbums();
  }, []);
  console.log("Current albums length:", albums.length);

  const renderItem = useCallback(
    ({ item, index }: { item: Album; index: number }) => (
      <RecordComp
        album={item}
        isSelected={item.id === selectedId}
        onPress={() => handleSelectAndScroll(item, index)}
        index={index}
        totalLength={albums.length}
      />
    ),
    [selectedId, handleSelectAndScroll, albums.length]
  );

  return (
    <LinearGradient
      colors={gradientColors as [string, string]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 flex-row">
          <View className="w-[40%] h-full">
            <View className="flex-1">
              <MotiView
                key={pathname}
                from={{
                  opacity: 0,
                  translateX: -20,
                }}
                animate={{
                  opacity: 1,
                  translateX: 0,
                }}
                transition={{
                  type: "timing",
                  duration: 1000,
                }}
                className="flex-1"
              >
                <FlashList
                  ref={listRef}
                  className="flex-1"
                  data={albums}
                  renderItem={renderItem}
                  estimatedItemSize={214}
                  showsVerticalScrollIndicator={false}
                  extraData={selectedId}
                  contentContainerStyle={{
                    paddingTop: 20,
                    paddingHorizontal: 16,
                  }}
                />
              </MotiView>
            </View>
          </View>
          <AlbumDetails
            genre="funk" // or "soul" for explore.tsx
            albums={albums}
            selectedId={selectedId || ""}
            selectedArtist={selectedArtist}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
