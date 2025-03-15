import { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MotiView } from "moti";

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
            source={{ uri: album.images[0]?.url }}
            className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded shadow-md ${
              isSelected ? " ring ring-gray-50" : ""
            }`}
            onError={(e) =>
              console.log("Error loading artist image:", e.nativeEvent.error)
            } // Log errors
          />
        </Pressable>
      </MotiView>
    </MotiView>
  );
}
