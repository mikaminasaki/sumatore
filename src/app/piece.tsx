import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PuzzleBoard } from "@/components/puzzle-board";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { categories, getCategory, getLevelsByCategory } from "@/data/lessons";
import { getPiece, pieces } from "@/data/puzzles";
import { useProgress } from "@/hooks/use-progress";

// ピースゲット画面。カテゴリの最後のレベルを初めてクリアしたとき、
// クリア画面を暗くして、その上にカードをモーダルのように出す
export default function PieceScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { isCleared } = useProgress();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 420);
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

  const [cardScale] = useState(() => new Animated.Value(0.85));
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [cardScale]);

  return (
    <View
      style={[
        styles.backdrop,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <Animated.View
        accessibilityViewIsModal
        style={[
          styles.card,
          { width: cardWidth, transform: [{ scale: cardScale }] },
        ]}
      >
        <Text
          style={[styles.title, { color: accent.main }]}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {category ? `${category.title} クリア！` : "クリア！"}
        </Text>
        <PuzzleBoard
          course={course}
          collectedCategoryIds={others}
          newCategoryId={categoryId}
          size={cardWidth - 48}
        />
        {piece && (
          <Text style={styles.message}>
            「{piece.name}」の ピース ゲット！
          </Text>
        )}
        <Text style={styles.count}>
          <Text style={[styles.countBig, { color: accent.main }]}>
            {others.length + 1}
          </Text>{" "}
          / {total} 枚
        </Text>

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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  card: {
    alignItems: "center",
    gap: 16,
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: { fontSize: 36, fontWeight: "bold" },
  message: {
    fontSize: fontSize.body,
    lineHeight: 30,
    color: colors.text,
    textAlign: "center",
  },
  count: { fontSize: fontSize.body, color: colors.textSub },
  countBig: { fontSize: fontSize.title, fontWeight: "bold" },
  button: {
    alignSelf: "stretch",
    marginTop: 4,
    minHeight: minTouchSize,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: fontSize.body,
    fontWeight: "bold",
    color: colors.white,
  },
  pressed: { opacity: 0.8 },
});
