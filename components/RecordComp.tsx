import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MotiView } from "moti";
import { Image } from "expo-image"; // Consider using expo-image instead

export interface Album {
  id: string;
  images: { url: string }[];
  name: string;
  artists: { id: string; name: string }[]; // Added id to artists
  popularity: number;
  release_date: string;
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
  const { width } = useWindowDimensions(); // Add this import from react-native
  const [imageError, setImageError] = useState(false);

  // Get the best quality image URL or fallback
  const getImageUrl = () => {
    if (imageError || !album.images?.[0]?.url) {
      return "https://via.placeholder.com/300"; // Fallback image
    }
    // Ensure HTTPS and handle cross-origin issues
    const imageUrl = album.images[0].url;
    return imageUrl.replace("http://", "https://");
  };

  // Adjust scale based on screen size
  const getScale = () => {
    if (width < 640) {
      // mobile
      return isSelected ? 1.5 : 0.9;
    } else if (width < 1024) {
      // tablet
      return isSelected ? 2 : 1;
    } else {
      // desktop
      return isSelected ? 2.5 : 1;
    }
  };
  const randomRotation = Math.random() * 20 - 10;

  return (
    <MotiView
      animate={{
        scale: getScale(),
      }}
      transition={{
        type: "spring",
        damping: 30, // Controls how quickly the spring stops
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
            isSelected ? "z-30 mx-12 md:my-24" : ""
          }`}
        >
          <Image
            source={{ uri: getImageUrl() }}
            className={`
            w-[80px] h-[80px] 
            md:w-[100px] md:h-[100px] 
            rounded-lg shadow-lg
            ${isSelected ? "ring-4 ring-white" : ""}
          `}
            contentFit="cover"
            transition={200}
            onError={() => setImageError(true)}
          />
        </Pressable>
      </MotiView>
    </MotiView>
  );
}
