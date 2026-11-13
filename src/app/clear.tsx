import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CelebrationBackground } from "@/components/celebration-background";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel, getNextLevel } from "@/data/lessons";
import { pickClearCharacter } from "@/data/characters";

// クリア画面。光と紙吹雪の中でキーコが跳ねる。次のレベルへ進めるようにする
export default function ClearScreen() {
  const { levelId, earnedPiece } = useLocalSearchParams<{ levelId: string; earnedPiece?: string }>();
  const insets = useSafeAreaInsets();
  const level = getLevel(levelId);
  const next = getNextLevel(levelId);
  const accent = accents[(level && getCategory(level.categoryId)?.course) ?? "basic"];

  // キーコの画像はクリアするたびに変わる (この画面を開いたときに 1 回だけ選ぶ)
  const [character] = useState(pickClearCharacter);
  const { height } = useWindowDimensions();

  // 画面が出たら、ぶるっと震わせて、キーコを ぴょんぴょん 跳ねさせる
  const [jump] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const hop = Animated.sequence([
      Animated.timing(jump, { toValue: -24, duration: 220, useNativeDriver: true }),
      Animated.spring(jump, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]);
    Animated.sequence([hop, Animated.delay(150), hop]).start();
  }, [jump]);

  // このクリアでピースがもらえたら、少し間をおいてピースゲット画面を重ねて出す
  const categoryId = level?.categoryId;
  useEffect(() => {
    if (earnedPiece !== "1" || !categoryId) return;
    const timer = setTimeout(() => router.push({ pathname: "/piece", params: { categoryId } }), 900);
    return () => clearTimeout(timer);
  }, [earnedPiece, categoryId]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar style="dark" />
      {/* 光の中心は、キーコのあたり */}
      <CelebrationBackground centerY={height * 0.36} />
      <View style={styles.main}>
        <Animated.View style={[styles.character, { transform: [{ translateY: jump }] }]}>
          <Image
            source={character}
            accessibilityLabel="キャラクター"
            style={styles.characterImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={[styles.title, { color: accent.main }]} numberOfLines={1} adjustsFontSizeToFit>
          {level ? `レベル${level.level}クリア！` : "クリア！"}
        </Text>
      </View>

      <View style={styles.buttons}>
        {next && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace({ pathname: "/lesson/[levelId]", params: { levelId: next.id } })}
            style={({ pressed }) => [styles.primary, { backgroundColor: accent.main, borderBottomColor: accent.dark }, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>次の レベルへ</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>レベル 一覧に 戻る</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDF6", paddingHorizontal: 20, justifyContent: "center", gap: 72 },
  // キーコ・見出し・ボタンをまとめて、画面の真ん中に寄せる
  main: { alignItems: "center", gap: 24 },
  character: { justifyContent: "flex-end" },
  characterImage: { width: 300, height: 300 },
  title: { fontSize: 48, fontWeight: "bold" },
  buttons: { gap: 12 },
  primary: {
    minHeight: minTouchSize,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: fontSize.body, fontWeight: "bold", color: colors.white },
  secondary: {
    minHeight: 56,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: fontSize.small, fontWeight: "bold", color: colors.text },
  pressed: { opacity: 0.8 },
});
