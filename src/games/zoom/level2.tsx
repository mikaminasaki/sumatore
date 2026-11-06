import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

const PHOTO_WIDTH = 120;
const PHOTO_HEIGHT = 90;
// ステップごとに合わせる大きさ (もとの写真の何倍か)
const TARGETS = [1.8, 0.7, 2.4];
// シニア向けに、ぴったりでなくても合格にする
const TOLERANCE = 0.2;

// 拡大・縮小編 レベル 2: 写真を点線の枠の大きさに合わせる
function ZoomLevel2({ step, onStepComplete }: GameProps) {
  const target = TARGETS[step];

  return (
    <View style={styles.wrapper}>
      <View
        pointerEvents="none"
        style={[styles.frame, { width: PHOTO_WIDTH * target, height: PHOTO_HEIGHT * target }]}
      />
      <ZoomArea
        maxScale={3}
        onPinchEnd={(scale) => {
          if (Math.abs(scale - target) / target <= TOLERANCE) onStepComplete();
        }}
      >
        <View style={styles.photo} accessibilityLabel="写真。2本の指で 大きく・小さく できます">
          {/* 写真は #7 で差し替える */}
          <Ionicons name="image" size={64} color={colors.clearGreen} />
        </View>
      </ZoomArea>
    </View>
  );
}

const steps = [
  { instruction: "写真を 大きくして、点線の わくに あわせましょう", hint: "2本の指を ゆっくり ひろげます。わくと 同じくらいで 指を はなします" },
  { instruction: "こんどは 小さな わくに あわせましょう", hint: "2本の指を ちかづけて 写真を 小さくします" },
  { instruction: "さいごは 大きな わくに あわせましょう", hint: "1回で とどかなければ、指を はなして もう一度 ひろげます" },
];

export const zoom2: Game = { steps, Component: ZoomLevel2 };

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "center" },
  frame: {
    position: "absolute",
    borderWidth: 3,
    borderStyle: "dashed",
    borderRadius: 8,
    borderColor: colors.burntOrange,
    zIndex: 1,
  },
  photo: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
