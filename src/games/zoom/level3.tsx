import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, minTouchSize } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

const ANSWER = "りんご";
const CHOICES = ["みかん", "りんご", "ぶどう"];

// 拡大・縮小編 レベル 3: 小さな文字を拡大して読み、書いてある言葉を選ぶ
function ZoomLevel3({ step, onStepComplete }: GameProps) {
  const [wrong, setWrong] = useState(false);

  return (
    <View style={styles.wrapper}>
      <ZoomArea
        pannable
        minScale={1}
        onPinchEnd={(scale) => {
          if (step === 0 && scale >= 2) onStepComplete();
        }}
      >
        <View style={styles.note}>
          <Text style={styles.noteText}>きょうの おやつは {ANSWER} です</Text>
        </View>
      </ZoomArea>

      {/* 拡大してから答えてもらうため、選択肢は 2 ステップ目で出す */}
      {step === 1 && (
        <View style={styles.choices}>
          {wrong && <Text style={styles.retry}>もういちど 読んでみましょう</Text>}
          <View style={styles.choiceRow}>
            {CHOICES.map((choice) => (
              <Pressable
                key={choice}
                accessibilityRole="button"
                onPress={() => (choice === ANSWER ? onStepComplete() : setWrong(true))}
                style={({ pressed }) => [styles.choice, pressed && styles.pressed]}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export const zoom3: Game = {
  steps: [
    {
      instruction: "小さな 文字を、読めるまで 大きくしましょう",
      hint: "2本の指を ひろげます。1回で 足りなければ、もう一度 ひろげます",
    },
    {
      instruction: "おやつは なんでしたか？ 下から えらびましょう",
      hint: "指 1本で 文字を うごかして、さいごまで 読みます",
    },
  ],
  Component: ZoomLevel3,
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignSelf: "stretch" },
  note: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4, backgroundColor: colors.white },
  noteText: { fontSize: 7, color: colors.text },
  choices: { padding: 10, gap: 8, backgroundColor: colors.white },
  retry: { fontSize: fontSize.small, fontWeight: "bold", color: colors.burntOrange, textAlign: "center" },
  choiceRow: { flexDirection: "row", gap: 8 },
  choice: {
    flex: 1,
    minHeight: minTouchSize,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: { fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  pressed: { opacity: 0.6 },
});
