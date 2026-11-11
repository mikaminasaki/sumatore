import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { getCategory, getLevel, getNextLevel } from "@/data/lessons";
import { pickPraise } from "@/data/praises";

// クリア画面。キーコが跳ねてほめてくれる。次のレベルへ進めるようにする
export default function ClearScreen() {
  const { levelId, earnedPiece } = useLocalSearchParams<{ levelId: string; earnedPiece?: string }>();
  const insets = useSafeAreaInsets();
  const level = getLevel(levelId);
  const next = getNextLevel(levelId);
  const accent = accents[(level && getCategory(level.categoryId)?.course) ?? "basic"];

  // 見出しはクリアするたびに変わる (この画面を開いたときに 1 回だけ選ぶ)
  const [praise] = useState(pickPraise);

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
      <View style={styles.main}>
        <Animated.View style={[styles.character, { transform: [{ translateY: jump }] }]}>
          <Image
            source={require("@/../assets/images/home/character.png")}
            accessibilityLabel="キャラクター"
            style={styles.characterImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={[styles.title, { color: accent.main }]} numberOfLines={1} adjustsFontSizeToFit>
          {praise}
        </Text>
        {level && (
          <Text style={styles.message}>
            レベル {level.level} クリア
          </Text>
        )}
      </View>

      <View style={styles.buttons}>
        {next && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace({ pathname: "/lesson/[levelId]", params: { levelId: next.id } })}
            style={({ pressed }) => [styles.primary, { backgroundColor: accent.main, borderBottomColor: accent.dark }, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>つぎの レベルへ</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>レベル いちらんに もどる</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
  main: { flex: 1, alignItems: "center", gap: 16 },
  character: { height: 200, justifyContent: "flex-end" },
  characterImage: { width: 190, height: 190 },
  title: { fontSize: 40, fontWeight: "bold" },
  message: { fontSize: fontSize.large, lineHeight: 34, color: colors.text, textAlign: "center" },
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
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: fontSize.small, fontWeight: "bold", color: colors.text },
  pressed: { opacity: 0.8 },
});
