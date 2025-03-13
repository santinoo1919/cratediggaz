import { View, Text, Pressable, Linking } from "react-native";
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

export default function HomeScreen() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const listRef = useRef<FlashList<Album>>(null);
  const { selectedId, selectedArtist, handleSelect } = useAlbumSelection();
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#4facfe",
    "#00f2fe",
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
    <LinearGradient
      colors={gradientColors as [string, string]}
      style={{ flex: 1 }}
    >
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
          <View className="w-[60%] place-content-center items-center gap-16">
            <View className="flex-col items-center gap-4">
              <Text className="text-5xl font-bold text-gray-900">
                Cratediggaz
              </Text>
              <Text className="text-md font-normal text-gray-800 w-[80%] text-center">
                A curated selection of records i own or think they are the
                quintessential records of all time for soul and funk between
                1972 and 1982.
              </Text>
            </View>

            <View className="flex-col items-center gap-2">
              <Image
                source={{ uri: selectedArtist?.images[0]?.url }}
                className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md"
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
    </LinearGradient>
  );
}
