import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

// クリア画面。手に入れたパズルのピースを見せる
export default function ClearScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.overlay, { paddingTop: insets.top + 8 }]}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
        <Text style={styles.backText}>もどる</Text>
      </Pressable>
      <View style={styles.card}>
        <Ionicons name="extension-puzzle" size={140} color="#F28B9B" />
        <Text style={styles.title}>げっちゅ</Text>
        <Text style={styles.message}>おめでとう！</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(120,120,120,0.6)", paddingHorizontal: 24 },
  back: { flexDirection: "row", alignItems: "center", minHeight: minTouchSize, alignSelf: "flex-start" },
  backText: { fontSize: fontSize.large, color: colors.text },
  card: {
    flex: 1,
    marginBottom: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: { fontSize: fontSize.title, fontWeight: "bold", color: colors.text },
  message: { fontSize: fontSize.body, color: colors.text },
});
