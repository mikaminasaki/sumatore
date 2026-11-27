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
// 点線の色。写真 (ピンク・緑・ベージュ) とも、練習エリアの薄い緑ともかぶらない鮮やかな青
const FRAME_COLOR = "#0050FF";

// 点線 1 本ずつの長さ・すき間・太さ・白いふちの太さ
const GAP = 7;
const THICK = 5;
const EDGE = 3;
// 点線 1 本の長さ (青い部分 10 ＋ 両端の白いふち)
const DASH = 10 + EDGE * 2;

// 1 辺ぶんの点線。点線 1 本ずつに白いふちを付けて、写真の上でも見えるようにする
function DashedLine({
  length,
  vertical,
}: {
  length: number;
  vertical?: boolean;
}) {
  const count = Math.max(1, Math.floor((length + GAP) / (DASH + GAP)));
  // 両端に点線が来るように、すき間を広げて調整する
  const gap = count > 1 ? (length - count * DASH) / (count - 1) : 0;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const offset = count > 1 ? i * (DASH + gap) : (length - DASH) / 2;
        return (
          <View
            key={i}
            style={[
              styles.dash,
              vertical
                ? {
                    top: offset,
                    left: 0,
                    width: THICK + EDGE * 2,
                    height: DASH,
                  }
                : {
                    left: offset,
                    top: 0,
                    width: DASH,
                    height: THICK + EDGE * 2,
                  },
            ]}
          />
        );
      })}
    </>
  );
}

// 点線の枠 (四角の 4 辺)
function DashedFrame({ width, height }: { width: number; height: number }) {
  const t = THICK + EDGE * 2;
  return (
    <View pointerEvents="none" style={[styles.frame, { width, height }]}>
      <View style={{ position: "absolute", top: 0, left: 0, width, height: t }}>
        <DashedLine length={width} />
      </View>
      <View
        style={{ position: "absolute", bottom: 0, left: 0, width, height: t }}
      >
        <DashedLine length={width} />
      </View>
      {/* 縦の辺は、角の点線と重ならないよう上下を空ける */}
      <View
        style={{
          position: "absolute",
          top: t + GAP,
          left: 0,
          width: t,
          height: height - (t + GAP) * 2,
        }}
      >
        <DashedLine length={height - (t + GAP) * 2} vertical />
      </View>
      <View
        style={{
          position: "absolute",
          top: t + GAP,
          right: 0,
          width: t,
          height: height - (t + GAP) * 2,
        }}
      >
        <DashedLine length={height - (t + GAP) * 2} vertical />
      </View>
    </View>
  );
}

// 拡大・縮小編 レベル 2: 写真を点線の枠の大きさに合わせる
function ZoomLevel2({ step, onStepComplete }: GameProps) {
  const target = TARGETS[step];

  return (
    <View style={styles.wrapper}>
      {/* 点線の枠。写真の上に重なっても見えるよう、写真にない色にする */}
      <DashedFrame
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
    instruction: "写真を大きくして、点線の枠に合わせましょう",
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
  dash: {
    position: "absolute",
    borderRadius: 3,
    borderWidth: EDGE,
    borderColor: colors.white,
    backgroundColor: FRAME_COLOR,
  },
  photo: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    borderRadius: 8,
  },
});
