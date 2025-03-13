import { useState } from "react";
import { View, Image, Text, TouchableOpacity, Pressable } from "react-native";

export interface Album {
  id: string;
  images: { url: string }[];
  name: string;
  artists: { id: string; name: string }[]; // Added id to artists
}

interface RecordProps {
  album: Album;
  isSelected: boolean;
  onPress: () => void;
}

export default function RecordComp({
  album,
  isSelected,
  onPress,
  index,
  totalLength,
}: {
  album: Album;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  totalLength: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const scale = isSelected ? 1.1 : 1; // Slightly larger when selected
  const translateX = isSelected ? 10 : 0; // Move to the right when selected
  return (
    <View
      className="w-full items-center p-2.5 mb-8 rounded-xl"
      style={{ transform: [{ translateX }, { scale }] }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        className={`flex-row items-center justify-center ${
          isSelected
            ? "rounded-sm outline-4 ring-4 ring-blue-500 ring-offset-4"
            : ""
        }`}
      >
        <Image
          source={{ uri: album.images[0]?.url }}
          className="w-[100px] h-[100px] md:w-[300px] md:h-[300px] rounded"
        />
      </Pressable>
    </View>
  );
}
