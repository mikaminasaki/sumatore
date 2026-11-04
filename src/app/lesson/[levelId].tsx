import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

const TOTAL_STEPS = 3;

// 練習中の画面。ピンチ操作の判定やステップの進行は #5 / #6 で実装する
export default function LessonScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { markCleared } = useProgress();
  const insets = useSafeAreaInsets();
  const level = getLevel(levelId);
  const category = level ? getCategory(level.categoryId) : undefined;
  const accent = accents[category?.course ?? "basic"];
  const step = 1;

  return (
    <View style={styles.container}>
      <AppHeader title={level ? `レベル ${level.level}` : ""} subtitle={category?.title} leftButton="close" accent={accent} />

      <View style={styles.stepRow}>
        <Text style={styles.stepText}>
          ステップ {step} / {TOTAL_STEPS}
        </Text>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View key={i} style={[styles.stepBar, i < step && { backgroundColor: accent.main }]} />
        ))}
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.guide}>
          <View style={styles.character}>
            {/* キャラクター画像は #7 で差し替える */}
            <Ionicons name="happy" size={48} color={colors.brandRed} />
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{level?.description}</Text>
          </View>
        </View>

        <View style={styles.practiceArea}>
          <Text style={styles.practiceText}>[練習する画面のエリア]</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              markCleared(levelId);
              router.replace({ pathname: "/clear", params: { levelId } });
            }}
            style={styles.tempButton}
          >
            <Text style={styles.tempButtonText}>（仮）クリアする</Text>
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.hintButton, { borderColor: accent.main }, pressed && styles.pressed]}>
          <Text style={[styles.hintText, { color: accent.main }]}>ヒントを 見る</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepText: { fontSize: 15, color: colors.text, marginRight: 6 },
  stepBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border },
  body: { flex: 1, padding: 16, gap: 16 },
  guide: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  character: { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  bubble: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  bubbleText: { fontSize: fontSize.body, lineHeight: 30, color: colors.text },
  practiceArea: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.practiceBorder,
    backgroundColor: colors.practiceArea,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  practiceText: { fontSize: fontSize.small, color: colors.clearGreen },
  tempButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.white },
  tempButtonText: { fontSize: fontSize.small, color: colors.textSub },
  hintButton: {
    minHeight: minTouchSize,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: { fontSize: fontSize.body, fontWeight: "bold" },
  pressed: { opacity: 0.7 },
});
