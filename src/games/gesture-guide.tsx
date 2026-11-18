import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, type ComponentProps } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import type { GestureGuideType } from "@/games/types";

type Props = {
  type: GestureGuideType;
};

// 手の絵の大きさ
const ICON_SIZE = 120;
// 1 回の動きにかける時間
const MOVE_MS = 1100;
// 指が動く距離
const SPREAD = 28;

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

// ふちの太さ。同じアイコンを 8 方向に少しずらして下に重ね、ふちに見せる
const OUTLINE = 2.5;
const OUTLINE_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
].map(([x, y]) => [x * OUTLINE, y * OUTLINE]);

// ふち付きのアイコン (写真の上でも見えるように)
function OutlinedIcon({ name, size, color, outline }: { name: IconName; size: number; color: string; outline: string }) {
  return (
    <View style={{ width: size, height: size }}>
      {OUTLINE_OFFSETS.map(([x, y], i) => (
        <MaterialCommunityIcons key={i} name={name} size={size} color={outline} style={[styles.layer, { left: x, top: y }]} />
      ))}
      <MaterialCommunityIcons name={name} size={size} color={color} style={styles.layer} />
    </View>
  );
}

// ---- 2本の指でつまむ・広げる手 ----
// 手のひらと、根元で回る人差し指・親指で描く。指先は斜めに開いたり閉じたりする
const FINGER_WIDTH = 22;
const BORDER = 3;
// 指の根元の位置と長さ (手の絵の中の座標)
const INDEX = { x: 88, y: 84, length: 50 };
const THUMB = { x: 70, y: 100, length: 48 };
// 指の角度 (真上を 0 として時計回り)。閉じると指先がくっつき、開くと右上と左下に離れる
const ANGLES = {
  closed: { index: -60, thumb: -31 },
  open: { index: -8, thumb: -82 },
};

function Finger({ base, length, rotate }: { base: { x: number; y: number }; length: number; rotate: Animated.AnimatedInterpolation<string> }) {
  return (
    <Animated.View
      style={[
        styles.finger,
        {
          left: base.x - FINGER_WIDTH / 2,
          top: base.y - length,
          height: length + FINGER_WIDTH / 2,
          transformOrigin: `50% ${((length) / (length + FINGER_WIDTH / 2)) * 100}%`,
          transform: [{ rotate }],
        },
      ]}
    />
  );
}

function PinchHand({ progress, spread }: { progress: Animated.Value; spread: boolean }) {
  const [from, to] = spread ? [ANGLES.closed, ANGLES.open] : [ANGLES.open, ANGLES.closed];
  const index = progress.interpolate({ inputRange: [0, 1], outputRange: [`${from.index}deg`, `${to.index}deg`] });
  const thumb = progress.interpolate({ inputRange: [0, 1], outputRange: [`${from.thumb}deg`, `${to.thumb}deg`] });
  return (
    <View style={styles.hand}>
      <View style={styles.arrow}>
        <OutlinedIcon name="arrow-top-right-bottom-left" size={44} color={colors.white} outline={colors.text} />
      </View>
      <Finger base={THUMB} length={THUMB.length} rotate={thumb} />
      <Finger base={INDEX} length={INDEX.length} rotate={index} />
      {/* 曲げている中指・薬指 */}
      <View style={[styles.curled, { left: 98 }]} />
      <View style={[styles.curled, { left: 114, top: 76 }]} />
      <View style={styles.palm} />
    </View>
  );
}

// 動きごとの手の絵 (片手の指の動きと矢印が 1 つの絵になっている)
const ICONS: Record<GestureGuideType, IconName> = {
  "pinch-out": "gesture-spread",
  "pinch-in": "gesture-pinch",
  // pinch-out / pinch-in は PinchHand で描くので、ここの絵は使わない
  pan: "gesture-swipe-horizontal",
  tap: "gesture-tap",
};

// 練習エリアに重ねる、指の動かし方の案内。触ってもその下の操作の邪魔をしない。
// 白い絵に黒いふちを付けて、青空などの写真の上でも見えるようにする
export function GestureGuide({ type }: Props) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: MOVE_MS, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(300),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, type]);

  // 動かすときは左右、タップは押し込む
  const transform =
    type === "pan"
      ? [{ translateX: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-SPREAD, SPREAD, -SPREAD] }) }]
      : [{ translateY: progress.interpolate({ inputRange: [0, 0.4, 0.6, 1], outputRange: [0, 10, 10, 0] }) }];

  if (type === "pinch-out" || type === "pinch-in") {
    return (
      <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <PinchHand progress={progress} spread={type === "pinch-out"} />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={{ transform }}>
        <OutlinedIcon name={ICONS[type]} size={ICON_SIZE} color={colors.white} outline={colors.text} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  layer: { position: "absolute", left: 0, top: 0 },
  hand: { width: 150, height: 160, transform: [{ scale: 1.2 }] },
  arrow: { position: "absolute", left: 4, top: 8 },
  finger: {
    position: "absolute",
    width: FINGER_WIDTH,
    borderRadius: FINGER_WIDTH / 2,
    borderWidth: BORDER,
    borderColor: colors.text,
    backgroundColor: colors.white,
  },
  curled: {
    position: "absolute",
    top: 70,
    width: 20,
    height: 32,
    borderRadius: 10,
    borderWidth: BORDER,
    borderColor: colors.text,
    backgroundColor: colors.white,
  },
  palm: {
    position: "absolute",
    left: 64,
    top: 80,
    width: 66,
    height: 76,
    borderRadius: 26,
    borderWidth: BORDER,
    borderColor: colors.text,
    backgroundColor: colors.white,
  },
});
