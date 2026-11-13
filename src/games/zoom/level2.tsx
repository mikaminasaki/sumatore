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
        <View style={styles.photo} accessibilityLabel="写真。2本の指で大きく・小さくできます">
          {/* 写真は #7 で差し替える */}
          <Ionicons name="image" size={64} color={colors.clearGreen} />
        </View>
      </ZoomArea>
    </View>
  );
}

const steps = [
  { instruction: "写真を大きくして、点線の枠に合わせましょう", hint: "2本の指をゆっくり広げます。枠と同じくらいで指を離します" },
  { instruction: "今度は小さな枠に合わせましょう", hint: "2本の指を近づけて写真を小さくします" },
  { instruction: "最後は大きな枠に合わせましょう", hint: "1回で届かなければ、指を離してもう一度広げます" },
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
