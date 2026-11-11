import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel, getLevelsByCategory } from "@/data/lessons";
import { getGame } from "@/games/registry";
import { useProgress } from "@/hooks/use-progress";

// ステップができたときに「できた！」を出している時間
const CELEBRATE_MS = 1000;

// 練習画面。ステップのバー・吹き出し・ヒントは共通で、練習エリアにレベルごとのゲームを表示する。
// ゲームの中身は src/games/ にある (作り方は src/games/README.md)
export default function LessonScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { isCleared, markCleared } = useProgress();
  const insets = useSafeAreaInsets();
  const level = getLevel(levelId);
  const category = level ? getCategory(level.categoryId) : undefined;
  const accent = accents[category?.course ?? "basic"];
  const game = getGame(levelId);

  const [step, setStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const totalSteps = game?.steps.length ?? 1;
  const currentStep = game?.steps[step];

  const clear = () => {
    // このクリアでカテゴリの全レベルがそろったときだけ、ピースがもらえる (やり直しではもらえない)
    const earnedPiece =
      !!level &&
      !isCleared(levelId) &&
      getLevelsByCategory(level.categoryId).every((l) => l.id === levelId || isCleared(l.id));
    markCleared(levelId);
    router.replace({ pathname: "/clear", params: { levelId, earnedPiece: earnedPiece ? "1" : "0" } });
  };

  // ステップができたら、ぶるっと震わせて「できた！」を見せてから次へ進む
  const [celebrating, setCelebrating] = useState(false);
  const [celebrateScale] = useState(() => new Animated.Value(0));
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    };
  }, []);

  const handleStepComplete = () => {
    // 「できた！」の表示中は、続けて呼ばれても無視する
    if (celebrating) return;
    setCelebrating(true);
    setShowHint(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    celebrateScale.setValue(0);
    Animated.spring(celebrateScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    celebrateTimer.current = setTimeout(() => {
      setCelebrating(false);
      if (step + 1 >= totalSteps) clear();
      else setStep(step + 1);
    }, CELEBRATE_MS);
  };

  const bubbleText = showHint && currentStep ? currentStep.hint : (currentStep?.instruction ?? level?.description);

  const celebration = celebrating && (
    <View pointerEvents="none" style={styles.celebrate}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={[styles.celebrateBadge, { transform: [{ scale: celebrateScale }] }]}
      >
        <Ionicons name="checkmark-circle" size={72} color={colors.clearGreen} />
        <Text style={styles.celebrateText}>できた！</Text>
      </Animated.View>
    </View>
  );

  if (category?.id === "photo" && game) {
    return (
      <View style={[styles.albumLesson, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar style="dark" />
        <View style={styles.albumBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="練習を とじる" onPress={() => router.back()} style={styles.albumBarButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.albumBarTitle}>写真編 · レベル {level?.level}</Text>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: showHint }} onPress={() => setShowHint(!showHint)} style={styles.albumBarButton}>
            <Text style={styles.albumHint}>{showHint ? "とじる" : "ヒント"}</Text>
          </Pressable>
        </View>
        <View style={styles.albumTaskBox}>
          <Text style={styles.albumTaskLabel}>お題</Text>
          <Text style={styles.albumTask}>{currentStep?.instruction}</Text>
        </View>
        {showHint && (
          <Text accessibilityLiveRegion="polite" style={styles.albumHelp}>{currentStep?.hint}</Text>
        )}
        <game.Component step={step} onStepComplete={handleStepComplete} />
        {celebration}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={level ? `レベル ${level.level}` : ""} subtitle={category?.title} leftButton="close" accent={accent} />

      <View style={styles.stepRow}>
        <Text style={styles.stepText}>
          ステップ {step + 1} / {totalSteps}
        </Text>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View key={i} style={[styles.stepBar, i <= step && { backgroundColor: accent.main }]} />
        ))}
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.guide}>
          <View style={styles.character}>
            {/* キャラクター画像は #7 で差し替える */}
            <Ionicons name="happy" size={48} color={colors.brandRed} />
          </View>
          <View style={[styles.bubble, showHint && { borderColor: accent.main }]}>
            {showHint && <Text style={[styles.hintLabel, { color: accent.main }]}>ヒント</Text>}
            <Text style={styles.bubbleText}>{bubbleText}</Text>
          </View>
        </View>

        <View style={styles.practiceArea}>
          {game ? (
            <game.Component step={step} onStepComplete={handleStepComplete} />
          ) : (
            // ゲームがまだないレベル用の仮ボタン
            <Pressable accessibilityRole="button" onPress={clear} style={styles.tempButton}>
              <Text style={styles.tempButtonText}>（仮）クリアする</Text>
            </Pressable>
          )}
          {celebration}
        </View>

        {game && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowHint(!showHint)}
            style={({ pressed }) => [styles.hintButton, { borderColor: accent.main }, pressed && styles.pressed]}
          >
            <Text style={[styles.hintText, { color: accent.main }]}>{showHint ? "ヒントを とじる" : "ヒントを 見る"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  albumLesson: { flex: 1, backgroundColor: colors.white },
  albumBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 },
  albumBarButton: { minHeight: 48, minWidth: 48, paddingHorizontal: 8, alignItems: "center", justifyContent: "center" },
  albumBarTitle: { flexShrink: 1, fontSize: fontSize.small, color: colors.textSub },
  albumHint: { fontSize: fontSize.body, fontWeight: "bold", color: accents.practice.dark },
  albumHelp: { paddingHorizontal: 14, paddingVertical: 10, fontSize: fontSize.body, lineHeight: 30, color: accents.practice.dark, backgroundColor: accents.practice.pale },
  albumTaskBox: { paddingHorizontal: 14, paddingVertical: 10, gap: 4, backgroundColor: accents.practice.pale, borderLeftWidth: 4, borderLeftColor: accents.practice.main },
  albumTaskLabel: { fontSize: fontSize.small, fontWeight: "bold", color: accents.practice.dark },
  albumTask: { fontSize: fontSize.body, lineHeight: 30, fontWeight: "bold", color: colors.text },
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
  stepText: { fontSize: fontSize.small, color: colors.text, marginRight: 6 },
  stepBar: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.border },
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
  hintLabel: { fontSize: fontSize.small, fontWeight: "bold", marginBottom: 4 },
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
    overflow: "hidden",
  },
  celebrate: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
  celebrateBadge: {
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.clearGreen,
  },
  celebrateText: { fontSize: fontSize.title, fontWeight: "bold", color: colors.clearGreen, marginTop: 4 },
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
