import { View, Text, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordComp from "@/components/RecordComp";
import { useCallback, useEffect, useState } from "react";
import { searchAlbums } from "@/services/spotify";
import { FlashList } from "@shopify/flash-list";
import { Album } from "@/components/RecordComp";
import { Image } from "react-native";
import { useAlbumSelection } from "@/hooks/useAlbumSelection";
import { LinearGradient } from "expo-linear-gradient";
import ImageColors from "react-native-image-colors";
import { useRef } from "react";
import { MotiView } from "moti";
import { usePathname } from "expo-router";
import AlbumDetails from "@/components/AlbumDetails";

export default function ExploreScreen() {
  const pathname = usePathname();
  const [albums, setAlbums] = useState<Album[]>([]);
  const { selectedId, selectedArtist, handleSelect } = useAlbumSelection();
  const listRef = useRef<FlashList<Album>>(null);
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#0f172a", // slate-900
    "#1e293b", // slate-800
  ]);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        console.log("Fetching popular soul albums from 1972-1982...");
        const results = await searchAlbums("soul year:1972-1982");
        const sortedResults = results.sort(
          (a: Album, b: Album) => b.popularity - a.popularity
        );
        setAlbums(sortedResults);
        if (sortedResults[0]) {
          handleSelect(sortedResults[0] as Album, 0);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }

    fetchAlbums();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selectedAlbum = albums.find((album) => album.id === selectedId);
      if (selectedAlbum) {
        const imageUrl = selectedAlbum.images[0]?.url;
        ImageColors.getColors(imageUrl, {
          fallback: "#000000",
          cache: true,
          key: selectedId,
        }).then((result) => {
          if (result.platform === "android") {
            setGradientColors([result.dominant, result.average]);
          } else if (result.platform === "ios") {
            setGradientColors([result.primary, result.secondary]);
          } else {
            setGradientColors([result.vibrant, result.darkVibrant]);
          }
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
