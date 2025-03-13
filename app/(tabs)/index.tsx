import { View, Text, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordComp from "@/components/RecordComp";
import { useEffect, useState, useRef, useCallback } from "react";
import { searchAlbums } from "@/services/spotify";
import { FlashList } from "@shopify/flash-list";
import { Album } from "@/components/RecordComp";
import { Image } from "react-native";
import { useAlbumSelection } from "@/hooks/useAlbumSelection";

export default function HomeScreen() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const listRef = useRef<FlashList<Album>>(null);
  const { selectedId, selectedArtist, handleSelect } = useAlbumSelection();

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
        console.log("Fetching albums...");
        const results = await searchAlbums("jazz");
        setAlbums(results as Album[]);
        if (results[0]) {
          handleSelectAndScroll(results[0] as Album, 0);
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
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-row">
        <View className="w-[40%] h-full">
          <View className="flex-1">
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
          </View>
        </View>
        <View className="w-[60%] place-content-center items-center gap-48">
          <Text className="text-5xl font-bold">Cratediggaz</Text>
          <View className="flex-col items-center gap-2">
            <Image
              source={{ uri: selectedArtist?.images[0]?.url }}
              className="w-24 h-24 rounded-full"
            />
            <Text className="text-xl font-semibold">
              {albums.find((a) => a.id === selectedId)?.name}
            </Text>
            <Text>{selectedArtist?.name}</Text>

            <Text>{selectedArtist?.followers?.total}</Text>
            <Text>{selectedArtist?.genres.join(", ")}</Text>

            <Pressable
              className="bg-blue-500 p-2 rounded-lg"
              onPress={() =>
                Linking.openURL(selectedArtist?.external_urls.spotify)
              }
            >
              <Text className="text-white">Check it out </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
