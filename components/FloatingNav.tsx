import { Platform } from "react-native";
import { Link, usePathname } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function FloatingNav() {
  if (Platform.OS !== "web") return null;

  const pathname = usePathname();
  console.log("Current pathname:", pathname); // Debug log

  return (
    <View className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/10 rounded-full px-6 py-4 flex-row gap-8 border border-white/10">
      <Link href="/" asChild>
        <Pressable>
          <Text
            className={`text-white ${
              pathname === "/" || pathname === "/index"
                ? "font-bold text-white"
                : "font-normal text-white/60"
            }`}
          >
            Funk
          </Text>
        </Pressable>
      </Link>
      <Link href="/(tabs)/explore" asChild>
        <Pressable>
          <Text
            className={`text-white ${
              pathname.includes("explore")
                ? "font-bold text-white"
                : "font-normal text-white/60"
            }`}
          >
            Soul
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
