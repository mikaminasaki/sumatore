import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize } from "@/constants/theme";

type Props = {
  title: string;
  variant?: "logo" | "section";
  // section のとき左上にホームボタンを出す
  showHomeButton?: boolean;
};

export function AppHeader({ title, variant = "section", showHomeButton = false }: Props) {
  const insets = useSafeAreaInsets();
  const isLogo = variant === "logo";

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, backgroundColor: isLogo ? colors.brandRed : colors.green },
      ]}
    >
      {showHomeButton && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="ホームにもどる"
          onPress={() => router.dismissTo("/")}
          style={[styles.homeButton, { top: insets.top + 4 }]}
        >
          <Ionicons name="home-outline" size={28} color={colors.green} />
        </Pressable>
      )}
      <Text style={[styles.title, isLogo && styles.logo]} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
    minHeight: 64,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.title,
    fontWeight: "bold",
  },
  logo: {
    fontSize: fontSize.logo,
    letterSpacing: 4,
  },
  homeButton: {
    position: "absolute",
    left: 12,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
