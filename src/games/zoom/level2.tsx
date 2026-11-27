import { Image } from "expo-image";
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
// かぎかっこの色 (焼きオレンジ)。白いふちを付けて、写真の上でも見えるようにする
const FRAME_COLOR = colors.burntOrange;

// かぎかっこの線の太さ・白いふちの太さ・腕の長さ
const THICK = 6;
const EDGE = 4;
const ARM = 30;

type Corner = "tl" | "tr" | "bl" | "br";

// 角 1 つぶんのかぎかっこ。白い太い L の上に、オレンジの L を重ねる
function Bracket({ corner, arm }: { corner: Corner; arm: number }) {
  const top = corner[0] === "t";
  const left = corner[1] === "l";
  const pos = (offset: number) => ({
    [top ? "top" : "bottom"]: offset,
    [left ? "left" : "right"]: offset,
  });
  const outer = THICK + EDGE * 2;
  return (
    <>
      {/* 白いふち */}
      <View
        style={[
          styles.bar,
          styles.edge,
          pos(-EDGE),
          { width: arm + EDGE * 2, height: outer },
        ]}
      />
      <View
        style={[
          styles.bar,
          styles.edge,
          pos(-EDGE),
          { width: outer, height: arm + EDGE * 2 },
        ]}
      />
      {/* オレンジの線 */}
      <View
        style={[styles.bar, styles.line, pos(0), { width: arm, height: THICK }]}
      />
      <View
        style={[styles.bar, styles.line, pos(0), { width: THICK, height: arm }]}
      />
    </>
  );
}

// 合わせる大きさを示す枠。四隅のかぎかっこで表す
function CornerFrame({ width, height }: { width: number; height: number }) {
  // 小さな枠でも、かぎかっこ同士がくっつかない長さにする
  const arm = Math.min(ARM, width * 0.3, height * 0.3);
  return (
    <View pointerEvents="none" style={[styles.frame, { width, height }]}>
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <Bracket key={c} corner={c} arm={arm} />
      ))}
    </View>
  );
}

// 拡大・縮小編 レベル 2: 写真をかぎかっこの枠の大きさに合わせる
function ZoomLevel2({ step, onStepComplete }: GameProps) {
  const target = TARGETS[step];

  return (
    <View style={styles.wrapper}>
      {/* 合わせる大きさを、四隅のかぎかっこで示す */}
      <CornerFrame
        width={PHOTO_WIDTH * target}
        height={PHOTO_HEIGHT * target}
      />
      <ZoomArea
        maxScale={3}
        onPinchEnd={(scale) => {
          if (Math.abs(scale - target) / target <= TOLERANCE) onStepComplete();
        }}
      >
        <Image
          source={require("@/assets/images/zoom/rose.jpg")}
          contentFit="cover"
          style={styles.photo}
          accessibilityLabel="バラの写真。2本の指で大きく・小さくできます"
        />
      </ZoomArea>
    </View>
  );
}

const steps = [
  {
    instruction: "写真を大きくして、かぎかっこの枠に合わせましょう",
    hint: "2本の指をゆっくり広げます。枠と同じくらいで指を離します",
  },
  {
    instruction: "今度は小さな枠に合わせましょう",
    hint: "2本の指を近づけて写真を小さくします",
  },
  {
    instruction: "最後は大きな枠に合わせましょう",
    hint: "1回で届かなければ、指を離してもう一度広げます",
  },
];

export const zoom2: Game = { steps, Component: ZoomLevel2 };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: { position: "absolute", zIndex: 1 },
  bar: { position: "absolute", borderRadius: 3 },
  edge: { backgroundColor: colors.white, borderRadius: 5 },
  line: { backgroundColor: FRAME_COLOR },
  photo: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    borderRadius: 8,
  },
});
