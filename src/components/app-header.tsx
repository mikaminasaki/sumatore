import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { accents, colors, fontSize, type Accent } from "@/constants/theme";

type Props = {
  title: string;
  // タイトルの上に出す小さい見出し (例: 基本操作編)
  subtitle?: string;
  variant?: "logo" | "section";
  // 左上のボタン。back =「‹ もどる」、close =「× やめる」
  leftButton?: "back" | "close" | "none";
  // ヘッダーの色 (logo のときは使わない)
  accent?: Accent;
};

export function AppHeader({ title, subtitle, variant = "section", leftButton = "none", accent = accents.basic }: Props) {
  const insets = useSafeAreaInsets();

  if (variant === "logo") {
    return (
      <View style={[styles.container, styles.logoContainer, { backgroundColor: colors.homeRed, paddingTop: insets.top + 8 }]}>
        <Text style={[styles.title, styles.logo]} accessibilityRole="header">
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: accent.main, paddingTop: insets.top + 8 }]}>
      {leftButton !== "none" && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.leftButton, pressed && styles.pressed]}
        >
          <Ionicons name={leftButton === "back" ? "chevron-back" : "close"} size={26} color={accent.main} />
          <Text style={[styles.leftButtonText, { color: accent.main }]}>{leftButton === "back" ? "もどる" : "やめる"}</Text>
        </Pressable>
      )}
      <View style={styles.titles}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit>
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
  },
  logoContainer: { justifyContent: "center" },
  leftButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 52,
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: 24,
    backgroundColor: colors.white,
  },
  leftButtonText: { fontSize: 22, fontWeight: "bold" },
  titles: { flex: 1 },
  subtitle: { color: colors.white, fontSize: 14, fontWeight: "bold" },
  title: { color: colors.white, fontSize: fontSize.title, fontWeight: "bold" },
  logo: { fontSize: fontSize.logo, letterSpacing: 4 },
  pressed: { opacity: 0.7 },
});
