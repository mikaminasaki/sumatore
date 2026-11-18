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

// 動きごとの手の絵 (片手の指の動きと矢印が 1 つの絵になっている)
const ICONS: Record<GestureGuideType, IconName> = {
  "pinch-out": "gesture-spread",
  "pinch-in": "gesture-pinch",
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

  // 広げるときは小→大、縮めるときは大→小、動かすときは左右、タップは押し込む
  const transform =
    type === "pinch-out"
      ? [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] }) }]
      : type === "pinch-in"
        ? [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1.15, 0.8] }) }]
        : type === "pan"
          ? [{ translateX: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-SPREAD, SPREAD, -SPREAD] }) }]
          : [{ translateY: progress.interpolate({ inputRange: [0, 0.4, 0.6, 1], outputRange: [0, 10, 10, 0] }) }];

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
});
