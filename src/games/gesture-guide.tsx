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
// フリー素材の手のイラストを「手のひら・人差し指・親指」の 3 枚に分け、指だけを根元で回して開閉させる
const HAND_IMAGES = {
  palm: require("@/assets/images/gestures/hand-palm.png"),
  index: require("@/assets/images/gestures/hand-index.png"),
  thumb: require("@/assets/images/gestures/hand-thumb.png"),
};
// 画像は 532 × 620。3 枚とも同じ大きさで重ねる
const HAND_WIDTH = 190;
const HAND_HEIGHT = (HAND_WIDTH * 620) / 532;
// 指の根元 (回転の中心) の位置 (画像に対する割合)
const INDEX_ORIGIN = "52.2% 53.2%";
const THUMB_ORIGIN = "42.3% 62.1%";
// つまんだときの指の角度 (時計回りが +)。開いたときは 0
const CLOSED = { index: -14, thumb: 20 };

function PinchHand({ progress, spread }: { progress: Animated.Value; spread: boolean }) {
  // 広げるときは つまむ → 開く、縮めるときは 開く → つまむ
  const range = (closed: number) => (spread ? [`${closed}deg`, "0deg"] : ["0deg", `${closed}deg`]);
  const index = progress.interpolate({ inputRange: [0, 1], outputRange: range(CLOSED.index) });
  const thumb = progress.interpolate({ inputRange: [0, 1], outputRange: range(CLOSED.thumb) });
  return (
    <View style={styles.pinch}>
      <View style={styles.pinchArrow}>
        <OutlinedIcon name={spread ? "arrow-expand" : "arrow-collapse"} size={44} color={colors.white} outline={colors.text} />
      </View>
      <Animated.Image source={HAND_IMAGES.index} style={[styles.handLayer, { transformOrigin: INDEX_ORIGIN, transform: [{ rotate: index }] }]} />
      <Animated.Image source={HAND_IMAGES.thumb} style={[styles.handLayer, { transformOrigin: THUMB_ORIGIN, transform: [{ rotate: thumb }] }]} />
      <Animated.Image source={HAND_IMAGES.palm} style={styles.handLayer} />
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
  pinch: { width: HAND_WIDTH, height: HAND_HEIGHT, marginTop: 40 },
  pinchArrow: { position: "absolute", left: 6, top: 30, transform: [{ rotate: "90deg" }] },
  handLayer: { position: "absolute", left: 0, top: 0, width: HAND_WIDTH, height: HAND_HEIGHT },
});
