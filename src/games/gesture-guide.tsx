import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import type { GestureGuideType } from "@/games/types";

type Props = {
  type: GestureGuideType;
  // 矢印の色 (コースの色)
  color: string;
};

const HAND_SIZE = 72;
const ARROW_SIZE = 48;
// 1 回の動きにかける時間
const MOVE_MS = 1100;
// 指が動く距離
const SPREAD = 28;

// 白い手 (黒いふち付き)。アイコンを少し大きくした黒の上に白を重ねて、ふちに見せる
function Hand({ rotate = "0deg" }: { rotate?: string }) {
  return (
    <View style={[styles.hand, { transform: [{ rotate }] }]}>
      <MaterialCommunityIcons name="hand-pointing-up" size={HAND_SIZE + 8} color={colors.text} style={styles.handOutline} />
      <MaterialCommunityIcons name="hand-pointing-up" size={HAND_SIZE} color={colors.white} />
    </View>
  );
}

// 練習エリアに重ねる、指の動かし方の案内。触ってもその下の操作の邪魔をしない
export function GestureGuide({ type, color }: Props) {
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

  if (type === "pinch-out" || type === "pinch-in") {
    // 広げるときは内→外、縮めるときは外→内に指を動かす
    const [from, to] = type === "pinch-out" ? [0, SPREAD] : [SPREAD, 0];
    const offset = progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
    const negative = Animated.multiply(offset, -1);
    return (
      <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.pair}>
          <Animated.View style={[styles.side, { transform: [{ translateX: negative }, { translateY: offset }] }]}>
            <MaterialCommunityIcons name="arrow-top-right-bottom-left" size={ARROW_SIZE} color={color} />
            <Hand rotate="-20deg" />
          </Animated.View>
          <Animated.View style={[styles.side, { transform: [{ translateX: offset }, { translateY: offset }] }]}>
            <MaterialCommunityIcons name="arrow-top-left-bottom-right" size={ARROW_SIZE} color={color} />
            <Hand rotate="20deg" />
          </Animated.View>
        </View>
      </View>
    );
  }

  if (type === "pan") {
    // 指 1 本で左右に動かす
    const x = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, SPREAD * 1.5, 0] });
    return (
      <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Animated.View style={[styles.side, { transform: [{ translateX: x }] }]}>
          <MaterialCommunityIcons name="arrow-all" size={ARROW_SIZE} color={color} />
          <Hand />
        </Animated.View>
      </View>
    );
  }

  // tap: 指を押し込みながら、押す場所に丸が広がる
  const pressY = progress.interpolate({ inputRange: [0, 0.4, 0.6, 1], outputRange: [0, 12, 12, 0] });
  const ringScale = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.2, 1.2] });
  const ringOpacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.9, 0] });
  return (
    <View pointerEvents="none" style={styles.overlay} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.ring, { borderColor: color, opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={{ transform: [{ translateY: pressY }] }}>
        <Hand />
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
  pair: { flexDirection: "row", gap: 48, marginTop: 80 },
  side: { alignItems: "center" },
  hand: { width: HAND_SIZE + 8, height: HAND_SIZE + 8, alignItems: "center", justifyContent: "center" },
  handOutline: { position: "absolute" },
  ring: { position: "absolute", width: 64, height: 64, borderRadius: 32, borderWidth: 4, marginTop: -40 },
});
