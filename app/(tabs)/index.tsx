import {
  View,
  Text,
  Pressable,
  Linking,
  Animated,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordComp from "@/components/RecordComp";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
import { useGradientColors } from "@/hooks/useGradientColors";
import { useAlbumList } from "@/hooks/useAlbumList";
import AlbumList from "@/components/AlbumList";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { albums, selectedId, selectedArtist, handleSelectAndScroll, listRef } =
    useAlbumList();

  const gradientColors = useGradientColors(selectedId, albums);

  // Memoize the layout classes to prevent unnecessary re-renders
  const layoutClasses = useMemo(
    () => ({
      albumList: `sm:w-[40%] w-full h-[30%] sm:h-full`,
      albumDetails: `sm:w-[60%] w-full h-[70%] sm:h-full`,
    }),
    []
  );

  return (
    <LinearGradient
      colors={gradientColors as [string, string]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 sm:flex-row flex-col-reverse">
          <View className={layoutClasses.albumList}>
            <AlbumList
              ref={listRef}
              albums={albums}
              selectedId={selectedId}
              onSelect={handleSelectAndScroll}
              isHorizontal={width < 640}
            />
          </View>

          <View className={layoutClasses.albumDetails}>
            <AlbumDetails
              genre="funk"
              albums={albums}
              selectedId={selectedId || ""}
              selectedArtist={selectedArtist}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
