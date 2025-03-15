import { Platform } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Image as RNImage } from "react-native";

interface ImageProps {
  source: { uri: string };
  className?: string;
  onError?: () => void;
  style?: any;
}

export default function CrossPlatformImage({
  source,
  className,
  onError,
  style,
}: ImageProps) {
  if (Platform.OS === "web") {
    return (
      <RNImage
        source={{
          ...source,
          headers: {
            Accept: "image/webp,image/*,*/*;q=0.8",
            "Cache-Control": "no-cache",
          },
        }}
        className={className}
        onError={onError}
        style={style}
      />
    );
  }

  return (
    <ExpoImage
      source={source}
      className={className}
      onError={onError}
      style={style}
      contentFit="cover"
    />
  );
}
