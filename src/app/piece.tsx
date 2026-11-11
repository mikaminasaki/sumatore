import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PuzzleBoard } from "@/components/puzzle-board";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { categories, getCategory, getLevelsByCategory } from "@/data/lessons";
import { getPiece, pieces } from "@/data/puzzles";
import { useProgress } from "@/hooks/use-progress";

// ピースゲット画面。カテゴリの最後のレベルを初めてクリアしたとき、クリア画面の上にモーダルで出す
export default function PieceScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { isCleared } = useProgress();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const category = getCategory(categoryId);
  const piece = getPiece(categoryId);
  const course = category?.course ?? "basic";
  const accent = accents[course];

  // 全レベルをクリアしたカテゴリ = 持っているピース
  const collected = categories
    .filter((c) => c.course === course)
    .filter((c) => getLevelsByCategory(c.id).every((l) => isCleared(l.id)))
    .map((c) => c.id);
  const others = collected.filter((id) => id !== categoryId);
  const total = pieces[course].length;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.main}>
        <Text style={[styles.title, { color: accent.main }]} accessibilityRole="header">
          ピース ゲット！
        </Text>
        <PuzzleBoard
          course={course}
          collectedCategoryIds={others}
          newCategoryId={categoryId}
          size={Math.min(width - 48, 360)}
        />
        {category && piece && (
          <Text style={styles.message}>
            {category.title}を ぜんぶ クリアして{"\n"}「{piece.name}」の ピースを もらいました
          </Text>
        )}
        <Text style={styles.count}>
          {total}まい中 <Text style={[styles.countBig, { color: accent.main }]}>{others.length + 1}</Text>まい あつまったよ
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: accent.main, borderBottomColor: accent.dark },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.buttonText}>とじる</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 32 },
  main: { flex: 1, alignItems: "center", gap: 20 },
  title: { fontSize: 40, fontWeight: "bold" },
  message: { fontSize: fontSize.body, lineHeight: 30, color: colors.text, textAlign: "center" },
  count: { fontSize: fontSize.body, color: colors.textSub },
  countBig: { fontSize: fontSize.title, fontWeight: "bold" },
  button: {
    minHeight: minTouchSize,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: fontSize.body, fontWeight: "bold", color: colors.white },
  pressed: { opacity: 0.8 },
});
