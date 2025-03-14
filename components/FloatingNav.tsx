import { Platform } from "react-native";
import { Link, usePathname } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function FloatingNav() {
  if (Platform.OS !== "web") return null;

  const pathname = usePathname();
  console.log("Current pathname:", pathname); // Debug log

  return (
    <View className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-slate-950/20 to-slate-900/20 rounded-lg px-8 py-2 flex-row gap-8 border border-slate-50/10 shadow-md shadow-slate-900/40 items-center justify-center">
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
      <View className="flex-row text-slate-50/10">|</View>

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
