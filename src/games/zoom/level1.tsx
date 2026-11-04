import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, usePinchGesture } from "react-native-gesture-handler";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// 拡大・縮小編 レベル 1: 写真をピンチで 大きく → 小さく → もとの大きさ にする
function ZoomLevel1({ step, onStepComplete }: GameProps) {
  const [scale, setScale] = useState(1);
  // ピンチを始めたときの大きさ。指を離すたびに、今の大きさを引き継ぐ
  const baseScale = useRef(1);
  // 指を離した瞬間の判定用に、今の大きさを ref にも持っておく
  const currentScale = useRef(1);

  const pinch = usePinchGesture({
    runOnJS: true,
    onUpdate: (e) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, baseScale.current * e.scale));
      currentScale.current = next;
      setScale(next);
    },
    onDeactivate: () => {
      const scale = currentScale.current;
      baseScale.current = scale;
      if (step === 0 && scale >= 2) onStepComplete();
      else if (step === 1 && scale <= 0.7) onStepComplete();
      else if (step === 2 && scale >= 0.85 && scale <= 1.25) onStepComplete();
    },
  });

  return (
    <GestureDetector gesture={pinch}>
      <View style={styles.area} accessibilityLabel="写真。2本の指で 大きく・小さく できます">
        {/* 写真は #7 で差し替える */}
        <View style={[styles.photo, { transform: [{ scale }] }]}>
          <Ionicons name="image" size={96} color={colors.clearGreen} />
        </View>
      </View>
    </GestureDetector>
  );
}

export const zoom1: Game = {
  steps: [
    {
      instruction: "2本の指を 写真の上に おいて、ひろげて 大きくしましょう",
      hint: "親指と ひとさし指で 写真を つまんで、ゆっくり 指を はなしていきます",
    },
    {
      instruction: "こんどは 2本の指を ちぢめて、写真を 小さくしましょう",
      hint: "2本の指を 写真の上に おいて、指と指を ちかづけます",
    },
    {
      instruction: "さいごに、写真を もとの 大きさに もどしましょう",
      hint: "少しずつ ひろげたり ちぢめたりして、はじめの 大きさに あわせます",
    },
  ],
  Component: ZoomLevel1,
};

const styles = StyleSheet.create({
  area: { flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photo: {
    width: 160,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
