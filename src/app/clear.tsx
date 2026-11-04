import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel, getNextLevel } from "@/data/lessons";

// クリア画面。手に入れたパズルのピースを見せて、次のレベルへ進めるようにする
export default function ClearScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const insets = useSafeAreaInsets();
  const level = getLevel(levelId);
  const next = getNextLevel(levelId);
  const accent = accents[(level && getCategory(level.categoryId)?.course) ?? "basic"];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        <View style={styles.character}>
          {/* キャラクター画像は #7 で差し替える */}
          <Ionicons name="happy" size={120} color={colors.brandRed} />
        </View>
        <Text style={styles.title}>クリア！</Text>
        {level && (
          <Text style={styles.message}>
            レベル {level.level}「{level.description}」が{"\n"}できました
          </Text>
        )}
        <View style={styles.piece}>
          <View style={styles.pieceIcon} />
          <Text style={styles.pieceText}>パズルの ピースを 1まい もらいました</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        {next && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace({ pathname: "/lesson/[levelId]", params: { levelId: next.id } })}
            style={({ pressed }) => [styles.primary, { backgroundColor: accent.main, borderBottomColor: accent.dark }, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>つぎの レベルへ</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>レベル いちらんに もどる</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
  main: { flex: 1, alignItems: "center", gap: 16 },
  character: { height: 150, justifyContent: "center" },
  title: { fontSize: 40, fontWeight: "bold", color: colors.burntOrange },
  message: { fontSize: fontSize.body - 2, lineHeight: 28, color: colors.text, textAlign: "center" },
  piece: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F1DFAF",
    backgroundColor: colors.piecePale,
  },
  pieceIcon: { width: 32, height: 32, borderRadius: 6, backgroundColor: colors.piece },
  pieceText: { flex: 1, fontSize: fontSize.small, color: colors.text },
  buttons: { gap: 12 },
  primary: {
    minHeight: minTouchSize,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: fontSize.body, fontWeight: "bold", color: colors.white },
  secondary: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: fontSize.small, fontWeight: "bold", color: colors.text },
  pressed: { opacity: 0.8 },
});
