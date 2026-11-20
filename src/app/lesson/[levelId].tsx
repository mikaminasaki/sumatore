import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize } from "@/constants/theme";
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

  // ヘッダーの右に置くヒントボタン。開いているときは色を反転させて「とじる」にする
  const hintButton = game && (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={showHint ? "ヒントをとじる" : "ヒントを見る"}
      accessibilityState={{ expanded: showHint }}
      onPress={() => setShowHint(!showHint)}
      style={({ pressed }) => [
        styles.hintButton,
        showHint && { backgroundColor: accent.dark },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={showHint ? "close" : "bulb-outline"} size={18} color={showHint ? colors.white : accent.main} />
      <Text style={[styles.hintText, { color: showHint ? colors.white : accent.main }]}>
        {showHint ? "とじる" : "ヒント"}
      </Text>
    </Pressable>
  );

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
      <View style={[styles.albumLesson, { paddingBottom: insets.bottom }]}>
        <StatusBar style="light" />
        <AppHeader title={`レベル ${level?.level}`} subtitle="実践編・写真編" leftButton="close" accent={accent} right={hintButton} />
        {showHint && currentStep && (
          <View style={[styles.hintPanel, { backgroundColor: accent.main }]}>
            <View style={[styles.hintCaret, { borderBottomColor: colors.white }]} />
            <Text accessibilityLiveRegion="polite" style={styles.hintBand}>
              {currentStep.hint}
            </Text>
          </View>
        )}
        <View style={styles.albumTaskBox}>
          <Text style={styles.albumTaskLabel}>お題</Text>
          <Text style={styles.albumTask}>{currentStep?.instruction}</Text>
        </View>
        <game.Component step={step} onStepComplete={handleStepComplete} />
        {celebration}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={level ? `レベル ${level.level}` : ""} subtitle={category?.title} leftButton="close" accent={accent} right={hintButton} />

      {/* ヒントはボタンのすぐ下に、吹き出しのように出す */}
      {showHint && currentStep && (
        <View style={[styles.hintPanel, { backgroundColor: accent.main }]}>
          <View style={[styles.hintCaret, { borderBottomColor: colors.white }]} />
          <Text accessibilityLiveRegion="polite" style={styles.hintBand}>
            {currentStep.hint}
          </Text>
        </View>
      )}

      <View style={styles.stepRow}>
        <Text style={styles.stepText}>
          ステップ {step + 1} / {totalSteps}
        </Text>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View key={i} style={[styles.stepBar, i <= step && { backgroundColor: accent.main }]} />
        ))}
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>
        {/* お題 (実践編と同じ箱) */}
        <View style={styles.guide}>
          <View style={[styles.taskBox, { backgroundColor: accent.pale, borderLeftColor: accent.main }]}>
            <Text style={styles.taskLabel}>お題</Text>
            <Text style={styles.taskText}>{currentStep?.instruction ?? level?.description}</Text>
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

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  albumLesson: { flex: 1, backgroundColor: colors.white },
  albumTaskBox: { marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 6, borderRadius: 8, backgroundColor: colors.white, borderWidth: 2, borderColor: accents.practice.main, borderLeftWidth: 6 },
  albumTaskLabel: { fontSize: fontSize.body, fontWeight: "bold", color: accents.practice.dark },
  albumTask: { fontSize: fontSize.large, lineHeight: 34, fontWeight: "bold", color: colors.text },
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
  guide: { flexDirection: "row" },
  taskBox: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 4, borderRadius: 8, borderLeftWidth: 4 },
  taskLabel: { fontSize: fontSize.small, fontWeight: "bold", color: colors.text },
  taskText: { fontSize: fontSize.body, lineHeight: 30, fontWeight: "bold", color: colors.text },
  hintButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  hintText: { fontSize: 16, fontWeight: "bold" },
  hintPanel: { paddingHorizontal: 16, paddingBottom: 12 },
  // ボタンを指す小さな三角
  hintCaret: {
    alignSelf: "flex-end",
    marginRight: 36,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  hintBand: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: fontSize.body,
    lineHeight: 30,
    color: colors.text,
    backgroundColor: colors.white,
    overflow: "hidden",
  },

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
  pressed: { opacity: 0.7 },
});
