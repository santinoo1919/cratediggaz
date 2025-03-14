import { useState } from "react";
import { View, Image, Text, TouchableOpacity, Pressable } from "react-native";
import { MotiView } from "moti";

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

  const scale = isSelected ? 1.8 : 1; // Slightly larger when selected
  const translateX = isSelected ? 10 : 0; // Move to the right when selected
  const randomRotation = Math.random() * 20 - 10;

  return (
    <MotiView
      animate={{
        scale: isSelected ? 1.9 : 1,
      }}
      transition={{
        type: "spring",
        damping: 15, // Controls how quickly the spring stops
        stiffness: 500, // Controls how rigid/bouncy the spring is
      }}
      className="w-full items-center p-2.5 mb-8 rounded-xl"
    >
      <MotiView
        from={{ rotate: `${randomRotation}deg` }}
        animate={{ rotate: `${-randomRotation}deg` }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1000,
          delay: index * 100,
        }}
      >
        <Pressable
          onPress={onPress}
          onPressIn={() => setIsHovered(true)}
          onPressOut={() => setIsHovered(false)}
          className={`flex-row items-center justify-center ${
            isSelected ? "rounded-sm ring-4 ring-gray-50 my-16" : ""
          }`}
        >
          <Image
            source={{ uri: album.images[0]?.url }}
            className="w-[100px] h-[100px] md:w-[100px] md:h-[100px] rounded shadow-md"
          />
        </Pressable>
      </MotiView>
    </MotiView>
  );
}
