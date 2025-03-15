import { View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAlbumList } from "@/hooks/useAlbumList";
import { useGradientColors } from "@/hooks/useGradientColors";
import AlbumList from "@/components/AlbumList";
import AlbumDetails from "@/components/AlbumDetails";
import { useMemo } from "react";

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const { albums, selectedId, selectedArtist, handleSelectAndScroll, listRef } =
    useAlbumList("soul"); // Pass "soul" as the genre

  const gradientColors = useGradientColors(selectedId, albums);

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
              genre="soul"
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
