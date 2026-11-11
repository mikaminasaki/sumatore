import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize } from "@/constants/theme";

// Figma「ホーム画面ver.6」: 空と海の背景、キャラクターの吹き出し、2つのコースボタン
const SCENERY_RATIO = 232 / 412; // 下の海と花の絵の 高さ / 幅

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const sceneryHeight = width * SCENERY_RATIO;

  return (
    <View style={styles.container}>
      <AppHeader title="スマトレ" variant="logo" />
      <View style={styles.body}>
        {/* 背景 (飾りなので読み上げない) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants">
          <View style={styles.sun} />
          <Image source={require("@/../assets/images/home/cloud-left.png")} style={styles.cloudLeft} />
          <Image
            source={require("@/../assets/images/home/cloud-left.png")}
            style={[styles.cloudRight, { transform: [{ scaleX: -1 }] }]}
          />
          <Image
            source={require("@/../assets/images/home/scenery.png")}
            style={[styles.scenery, { height: sceneryHeight }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bubbleArea}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{"きょうも いっしょに\nれんしゅう しよう♪"}</Text>
          </View>
          <View style={styles.bubbleTail} />
        </View>

        <Image
          source={require("@/../assets/images/home/character.png")}
          accessibilityLabel="キャラクター"
          style={styles.character}
          resizeMode="contain"
        />

        <View style={[styles.buttons, { marginBottom: sceneryHeight * 0.32 }]}>
          <CourseButton
            title="基本操作編"
            icon="book-outline"
            color={accents.basic.main}
            onPress={() => router.push("/basic")}
          />
          <CourseButton
            title="実践編"
            icon="phone-portrait-outline"
            color={accents.practice.main}
            onPress={() => router.push("/practice")}
          />
        </View>
      </View>
    </View>
  );
}

function CourseButton({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.courseButton, { backgroundColor: color }, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={72} color={colors.white} />
      <Text style={styles.courseLabel}>{title}</Text>
    </Pressable>
  );
}

const SKY = "#E3F2FA";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, backgroundColor: SKY, paddingHorizontal: 24, paddingTop: 20 },
  sun: {
    position: "absolute",
    top: 12,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F38C55",
    opacity: 0.75,
  },
  cloudLeft: { position: "absolute", top: "38%", left: -16, width: 194, height: 146, opacity: 0.9 },
  cloudRight: { position: "absolute", top: "14%", right: -60, width: 230, height: 172, opacity: 0.9 },
  scenery: { position: "absolute", left: 0, right: 0, bottom: 0, width: "100%" },
  bubbleArea: { alignItems: "center", marginBottom: 4 },
  bubble: {
    alignSelf: "stretch",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gray,
    backgroundColor: colors.white,
  },
  bubbleText: { fontSize: fontSize.large, lineHeight: 36, color: colors.text, textAlign: "center" },
  // 吹き出しのしっぽ (キャラクターのほうを指す)
  bubbleTail: {
    width: 22,
    height: 22,
    marginTop: -12,
    backgroundColor: colors.white,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.gray,
    transform: [{ rotate: "45deg" }],
  },
  // 画面の高さに合わせて縮む
  // 絵の中でキャラクターが少し右にいるので、左にずらして真ん中に見せる
  character: {
    flex: 1,
    alignSelf: "center",
    width: 200,
    maxHeight: 200,
    minHeight: 100,
    marginBottom: 8,
    transform: [{ translateX: -12 }],
  },
  // 余った高さはボタンの上に回して、ボタンを下に寄せる
  buttons: { flexDirection: "row", gap: 20, marginTop: "auto" },
  courseButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  courseLabel: { color: colors.white, fontSize: fontSize.large, fontWeight: "bold" },
  pressed: { transform: [{ scale: 0.97 }] },
});
