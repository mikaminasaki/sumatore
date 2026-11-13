import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

const RAY_COUNT = 16;
const RAY_COLOR = "rgba(255, 205, 80, 0.28)";

// 紙吹雪と星。位置は画面の幅・高さに対する割合
const CONFETTI = [
  { x: 0.08, y: 0.13, w: 14, h: 30, rotate: -25, color: "#E53935" },
  { x: 0.86, y: 0.12, w: 14, h: 32, rotate: 30, color: "#1F5FAF" },
  { x: 0.27, y: 0.09, w: 12, h: 12, rotate: 0, color: "#43A047", round: true },
  { x: 0.72, y: 0.08, w: 12, h: 12, rotate: 0, color: "#F2B600", round: true },
  { x: 0.1, y: 0.43, w: 12, h: 12, rotate: 0, color: "#1F5FAF", round: true },
  { x: 0.88, y: 0.45, w: 12, h: 12, rotate: 0, color: "#E53935", round: true },
  { x: 0.04, y: 0.33, w: 12, h: 26, rotate: 15, color: "#43A047" },
  { x: 0.9, y: 0.34, w: 12, h: 26, rotate: -20, color: "#F2B600" },
];
const STARS = [
  { x: 0.5, y: 0.07, size: 40 },
  { x: 0.15, y: 0.22, size: 28 },
  { x: 0.84, y: 0.24, size: 28 },
];

// クリア画面の背景。真ん中から広がる光と、紙吹雪・星
export function CelebrationBackground({ centerY }: { centerY: number }) {
  const { width, height } = useWindowDimensions();
  const radius = Math.hypot(width, height);
  const rayHalfWidth = Math.tan(Math.PI / RAY_COUNT / 2) * radius;

  // 紙吹雪と星は、ふわっと落ちてくる
  const [drop] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.spring(drop, { toValue: 1, friction: 6, tension: 30, useNativeDriver: true }).start();
  }, [drop]);
  const dropStyle = {
    opacity: drop,
    transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }],
  };

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} importantForAccessibility="no-hide-descendants">
      {Array.from({ length: RAY_COUNT }, (_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: width / 2 - radius,
            top: centerY - radius,
            width: radius * 2,
            height: radius * 2,
            transform: [{ rotate: `${(360 / RAY_COUNT) * i}deg` }],
          }}
        >
          {/* 真ん中に先がある三角形 */}
          <View
            style={{
              position: "absolute",
              left: radius - rayHalfWidth,
              top: 0,
              width: 0,
              height: 0,
              borderLeftWidth: rayHalfWidth,
              borderRightWidth: rayHalfWidth,
              borderTopWidth: radius,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: RAY_COLOR,
            }}
          />
        </View>
      ))}
      <Animated.View style={[StyleSheet.absoluteFill, dropStyle]}>
        {CONFETTI.map((c, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: c.x * width,
              top: c.y * height,
              width: c.w,
              height: c.h,
              borderRadius: c.round ? c.w / 2 : 3,
              backgroundColor: c.color,
              transform: [{ rotate: `${c.rotate}deg` }],
            }}
          />
        ))}
        {STARS.map((s, i) => (
          <Ionicons
            key={i}
            name="star"
            size={s.size}
            color="#F2B600"
            style={{ position: "absolute", left: s.x * width - s.size / 2, top: s.y * height }}
          />
        ))}
      </Animated.View>
    </View>
  );
}
