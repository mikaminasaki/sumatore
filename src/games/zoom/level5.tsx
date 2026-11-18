import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

// 写真の縦横比 (横 1120 × 縦 1400)
const PHOTO_ASPECT = 1120 / 1400;
// 猫がいる場所 (写真の幅・高さに対する割合)。猫は横 72〜80%・縦 60〜75% あたり。
// シニア向けに、まわりを少し広めに取る
const CAT_AREA = { left: "69%", top: "57%", width: "14%", height: "21%" } as const;

// 拡大・縮小編 レベル 5: 町の写真を拡大して、隠れている猫を探す
function ZoomLevel5({ step, onStepComplete }: GameProps) {
  return (
    <ZoomArea
      pannable
      minScale={1}
      onPinchEnd={(scale) => {
        if (step === 0 && scale >= 1.8) onStepComplete();
      }}
    >
      <View style={styles.scene}>
        <Image
          source={require("@/assets/images/zoom/street.jpg")}
          contentFit="cover"
          style={StyleSheet.absoluteFill}
          accessibilityLabel="雪の残る商店街の写真"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="猫"
          onPress={() => {
            if (step === 1) onStepComplete();
          }}
          style={[styles.cat, CAT_AREA]}
        />
      </View>
    </ZoomArea>
  );
}

export const zoom5: Game = {
  steps: [
    {
      instruction: "町の写真を大きくしましょう",
      hint: "2本の指を広げます",
    },
    {
      instruction: "ねこを探して、タップしましょう",
      hint: "八百屋さんの木の箱のあたりを見てみましょう",
    },
  ],
  Component: ZoomLevel5,
};

const styles = StyleSheet.create({
  scene: {
    height: "100%",
    aspectRatio: PHOTO_ASPECT,
    maxWidth: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  cat: { position: "absolute" },
});
