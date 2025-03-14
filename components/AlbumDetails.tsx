import {
  View,
  Text,
  Pressable,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import { Album } from "./RecordComp";
import { MotiView } from "moti";
import { useWikipediaInfo } from "../hooks/useWikipediaInfo";
import { Ionicons } from "@expo/vector-icons";
import { searchDiscogsRelease } from "../hooks/discogs";
import { useEffect } from "react";
import { useState } from "react";
import { Image } from "expo-image"; // Consider using expo-image instead

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
  const { description, url } = useWikipediaInfo(selectedArtist?.name);
  const [discogsUrl, setDiscogsUrl] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  const [artistImageError, setArtistImageError] = useState(false);
  const artistImageUrl =
    selectedArtist?.images?.[0]?.url || "https://via.placeholder.com/150";

  useEffect(() => {
    if (selectedArtist?.name && albums.find((a) => a.id === selectedId)?.name) {
      searchDiscogsRelease(
        selectedArtist.name,
        albums.find((a) => a.id === selectedId)?.name || ""
      ).then((result) => {
        if (result) {
          setDiscogsUrl(result.url);
          setPrice(result.price);
          setCurrency(result.currency);
        }
      });
    }
  }, [selectedId]);

  console.log("AlbumDetails props:", { genre, selectedId, selectedArtist }); // Debug log

  return (
    <ScrollView
      className=" w-full px-8 my-8 md:my-16 items-center "
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[600px]  flex-col items-center mb-8 md:mb-16">
        <Text className="text-xl font-bold text-slate-900/60">Cratediggaz</Text>
        <Text className="text-md font-light text-slate-800 w-[80%] text-center">
          A curated selection of quintessential records of all time between 1972
          and 1982.
        </Text>
      </View>

      <View className="w-full max-w-[600px] flex-col items-center gap-2 px-4">
        <MotiView
          key={selectedId} // Add this to trigger animation on selection change
          from={{
            opacity: 0,
            translateY: 300,
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
          <View className="w-full sm:w-[80%] flex-col items-center align-middle ">
            <Text className="text-lg md:text-4xl font-bold text-slate-900 text-center ">
              {albums.find((a) => a.id === selectedId)?.name}
            </Text>
            <Text className="text-md md:text-lg font-bold text-slate-900 text-center">
              {selectedArtist?.name}
            </Text>
            <Text className="text-sm md:text-md text-slate-900">
              {albums.find((a) => a.id === selectedId)?.release_date ||
                "Release date not available"}
            </Text>
            <View className="flex-col items-center gap-2 mt-4">
              <Image
                source={{ uri: artistImageUrl }}
                className="w-24 h-24 rounded-full border border-gray-100 shadow-md"
                contentFit="cover"
                transition={200}
                onError={() => setArtistImageError(true)}
              />
            </View>
          </View>
          <View className="flex-col items-center mb-4">
            <Text className="text-md font-normal text-gray-800 text-center">
              {selectedArtist?.followers?.total} followers
            </Text>
            <Text className="text-md font-normal text-gray-800 text-center">
              {selectedArtist?.genres?.join(", ")}
            </Text>
          </View>

          {description && (
            <Text className="text-sm md:text-lg font-light text-slate-900 text-center px-8 mb-4 ">
              {description}
            </Text>
          )}
          <Text
            className={`text-slate-900 text-md font-bold ${
              !discogsUrl ? "opacity-90" : ""
            }`}
          >
            {discogsUrl
              ? `from ${price ? `${currency} ${price}` : "Discogs"}`
              : "Not available"}
          </Text>
          <Pressable
            className="flex-row items-center gap-2 bg-slate-900 py-2 px-4 hover:bg-slate-800 transition-colors duration-200 rounded-lg  shadow-sm shadow-slate-900/40"
            onPress={() => {
              if (discogsUrl) {
                if (Platform.OS === "web") {
                  window.open(discogsUrl, "_blank");
                } else {
                  Linking.openURL(discogsUrl);
                }
              }
            }}
            disabled={!discogsUrl}
          >
            <Ionicons name="cart" size={16} color="#475569" />

            <Text className="text-white font-bold">Dig this</Text>
          </Pressable>
        </MotiView>
      </View>
    </ScrollView>
  );
}
