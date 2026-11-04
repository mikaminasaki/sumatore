import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

type Props = {
  title: string;
  onPress?: () => void;
  // 準備中のカテゴリは押せない表示にする
  disabled?: boolean;
  variant?: "green" | "white";
  rightIcon?: React.ComponentProps<typeof Ionicons>["name"];
};

// メニュー画面の横長ボタン (例: 「拡大・縮小編 >」)
export function MenuButton({ title, onPress, disabled = false, variant = "green", rightIcon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variant === "green" ? colors.greenLight : colors.white },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.title}>{disabled ? `${title}（準備中）` : title}</Text>
      <View style={styles.right}>
        {rightIcon && <Ionicons name={rightIcon} size={28} color={colors.gray} />}
        {!disabled && <Ionicons name="chevron-forward" size={28} color={colors.text} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchSize,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: "bold",
    color: colors.text,
  },
  right: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
