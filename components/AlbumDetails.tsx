import { View, Text, Pressable, Image, Linking, Platform } from "react-native";
import { Album } from "./RecordComp";
import { MotiView } from "moti";
import { useWikipediaInfo } from "../hooks/useWikipediaInfo";
import { Ionicons } from "@expo/vector-icons";
import { searchDiscogsRelease } from "../hooks/discogs";
import { useEffect } from "react";
import { useState } from "react";

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
    <View className="w-[60%] my-24 items-center gap-16">
      <View className="w-full max-w-[400px] flex-col items-center ">
        <Text className="text-xl font-bold text-slate-900/60">Cratediggaz</Text>
        <Text className="text-md font-light text-slate-800 w-[80%] text-center">
          A curated selection of quintessential records of all time between 1972
          and 1982.
        </Text>
      </View>

      <View className="w-full max-w-[600px] flex-col items-center gap-2">
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
            <Text className="text-4xl font-bold text-slate-900 text-center ">
              {albums.find((a) => a.id === selectedId)?.name}
            </Text>
            <Text className="text-lg font-bold text-slate-900">
              {selectedArtist?.name}
            </Text>
            <Text className="text-md text-slate-900">
              {albums.find((a) => a.id === selectedId)?.release_date ||
                "Release date not available"}
            </Text>
            <View className="flex-col items-center gap-2 mt-4">
              <Image
                source={{
                  uri:
                    selectedArtist?.images?.[0]?.url ||
                    "https://via.placeholder.com/150",
                }}
                className="w-24 h-24 rounded-full border border-gray-100 shadow-md"
              />
            </View>
          </View>
          <View className="flex-col items-center mb-4">
            <Text className="text-md font-normal text-gray-800">
              {selectedArtist?.followers?.total} followers
            </Text>
            <Text className="text-md font-normal text-gray-800">
              {selectedArtist?.genres?.join(", ")}
            </Text>
          </View>

          {description && (
            <Text className="text-lg font-light text-slate-800 text-center px-8 mb-4 ">
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
            className="flex-row items-center gap-2 bg-slate-900 py-2 px-4 hover:bg-slate-800 transition-colors duration-200 rounded-lg border border-slate-800 shadow-md shadow-slate-900/40"
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
    </View>
  );
}
