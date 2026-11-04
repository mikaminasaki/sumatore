import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { colors, fontSize } from "@/constants/theme";

// ホーム画面 (仮)。キャラクターや背景は #1 で Figma どおりに仕上げる
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="スマトレ" variant="logo" />
      <View style={styles.body}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>きょうも いっしょに れんしゅうしよう♪</Text>
        </View>
        <View style={styles.buttons}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/basic")}
            style={[styles.courseButton, { backgroundColor: colors.green }]}
          >
            <Ionicons name="book-outline" size={64} color={colors.white} />
            <Text style={styles.courseLabel}>基本操作編</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/practice")}
            style={[styles.courseButton, { backgroundColor: colors.orange }]}
          >
            <Ionicons name="phone-portrait-outline" size={64} color={colors.white} />
            <Text style={styles.courseLabel}>実践編</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF4FA" },
  body: { flex: 1, padding: 20, justifyContent: "space-between" },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  bubbleText: { fontSize: fontSize.body, color: colors.text },
  buttons: { flexDirection: "row", gap: 16, marginBottom: 20 },
  courseButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  courseLabel: { color: colors.white, fontSize: fontSize.body, fontWeight: "bold" },
});
