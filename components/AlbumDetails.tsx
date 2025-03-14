import { View, Text, Pressable, Image, Linking, Platform } from "react-native";
import { Album } from "./RecordComp";
import { MotiView } from "moti";

interface AlbumDetailsProps {
  genre: "funk" | "soul";
  albums: Album[];
  selectedId: string;
  selectedArtist: any;
}

export default function AlbumDetails({
  genre,
  albums,
  selectedId,
  selectedArtist,
}: AlbumDetailsProps) {
  console.log("AlbumDetails props:", { genre, selectedId, selectedArtist }); // Debug log

  return (
    <View className="w-[60%] my-24 items-center gap-16">
      <View className="w-full sm:w-[60%] flex-col items-center gap-2">
        <Text className="text-xl font-semibold text-gray-900">Cratediggaz</Text>
        <Text className="text-md font-normal text-gray-800 w-[80%] text-center">
          A curated selection of quintessential records of all time for {genre}{" "}
          between 1972 and 1982.
        </Text>
      </View>

      <View className="flex-col items-center gap-2">
        <MotiView
          key={selectedId} // Add this to trigger animation on selection change
          from={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: "spring",
            damping: 80,
            stiffness: 800,
          }}
          className="flex-col items-center gap-2"
        >
          <Image
            source={{
              uri:
                selectedArtist?.images?.[0]?.url ||
                "https://via.placeholder.com/150",
            }}
            className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md"
          />
          <View className="w-full sm:w-[80%] flex-col items-center align-middle ">
            <Text className="text-4xl font-semibold text-center">
              {albums.find((a) => a.id === selectedId)?.name}
            </Text>
            <Text className="text-lg font-medium text-gray-800">
              {selectedArtist?.name}
            </Text>
            <Text className="text-md font-normal text-gray-800">
              {selectedArtist?.release_date}
            </Text>
          </View>
          <View className="flex-col items-center mb-4">
            <Text className="text-md font-normal text-gray-800">
              {selectedArtist?.followers?.total} followers
            </Text>
            <Text className="text-md font-normal text-gray-800">
              {selectedArtist?.genres?.join(", ")}
            </Text>
          </View>
          <Pressable
            className="bg-gray-900 py-2 px-4 rounded-lg border-2 border-gray-800 shadow-md"
            onPress={() => {
              const spotifyUrl = selectedArtist?.external_urls?.spotify;
              if (Platform.OS === "web") {
                window.open(spotifyUrl, "_blank");
              } else {
                Linking.openURL(spotifyUrl);
              }
            }}
          >
            <Text className="text-white">Check it out</Text>
          </Pressable>
        </MotiView>
      </View>
    </View>
  );
}
