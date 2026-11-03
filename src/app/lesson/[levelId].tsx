import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { colors, fontSize, minTouchSize } from "@/constants/theme";
import { getLevel } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

// レッスン画面 (仮)。ピンチ操作の判定は #5 / #6 で実装する
export default function LessonScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { markCleared } = useProgress();
  const level = getLevel(levelId);

  return (
    <View style={styles.container}>
      <AppHeader title={level ? `Level ${level.level}` : ""} showHomeButton />
      <View style={styles.body}>
        <Text style={styles.description}>{level?.description}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            markCleared(levelId);
            router.replace({ pathname: "/clear", params: { levelId } });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>（仮）クリアする</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.greenPale },
  body: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center", gap: 32 },
  description: { fontSize: fontSize.large, color: colors.text, textAlign: "center" },
  button: {
    minHeight: minTouchSize,
    paddingHorizontal: 32,
    borderRadius: 32,
    backgroundColor: colors.green,
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontSize: fontSize.large, fontWeight: "bold" },
});
