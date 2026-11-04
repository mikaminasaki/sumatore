import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel } from "@/data/lessons";
import { getGame } from "@/games/registry";
import { useProgress } from "@/hooks/use-progress";

// 練習画面。ステップのバー・吹き出し・ヒントは共通で、練習エリアにレベルごとのゲームを表示する。
// ゲームの中身は src/games/ にある (作り方は src/games/README.md)
export default function LessonScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { markCleared } = useProgress();
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
    markCleared(levelId);
    router.replace({ pathname: "/clear", params: { levelId } });
  };

  const handleStepComplete = () => {
    setShowHint(false);
    if (step + 1 >= totalSteps) clear();
    else setStep(step + 1);
  };

  const bubbleText = showHint && currentStep ? currentStep.hint : (currentStep?.instruction ?? level?.description);

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
