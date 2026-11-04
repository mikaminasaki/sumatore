import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize } from "@/constants/theme";

type Props = {
  title: string;
  // タイトルの上に出す小さい見出し (例: 基本操作編)
  subtitle?: string;
  variant?: "logo" | "section";
  // 左上のボタン。back =「‹ もどる」、close =「× やめる」
  leftButton?: "back" | "close" | "none";
};

export function AppHeader({ title, subtitle, variant = "section", leftButton = "none" }: Props) {
  const insets = useSafeAreaInsets();

  if (variant === "logo") {
    return (
      <View style={[styles.container, styles.logoContainer, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.title, styles.logo]} accessibilityRole="header">
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {leftButton !== "none" && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.leftButton, pressed && styles.pressed]}
        >
          <Ionicons name={leftButton === "back" ? "chevron-back" : "close"} size={22} color={colors.blue} />
          <Text style={styles.leftButtonText}>{leftButton === "back" ? "もどる" : "やめる"}</Text>
        </Pressable>
      )}
      <View style={styles.titles}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    minHeight: 64,
    backgroundColor: colors.blue,
  },
  logoContainer: { justifyContent: "center" },
  leftButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 48,
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: 24,
    backgroundColor: colors.white,
  },
  leftButtonText: { color: colors.blue, fontSize: fontSize.body, fontWeight: "bold" },
  titles: { flex: 1 },
  subtitle: { color: colors.white, fontSize: 14, fontWeight: "bold" },
  title: { color: colors.white, fontSize: fontSize.large, fontWeight: "bold" },
  logo: { fontSize: fontSize.logo, letterSpacing: 4 },
  pressed: { opacity: 0.7 },
});
