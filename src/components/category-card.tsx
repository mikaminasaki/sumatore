import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NextBadge } from "@/components/next-badge";
import { StatusMark } from "@/components/status-mark";
import { accents, colors, fontSize, minTouchSize, type Accent } from "@/constants/theme";

type Props = {
  number: number;
  title: string;
  description: string;
  cleared: boolean;
  isNext?: boolean;
  // 準備中のカテゴリは押せない表示にする
  disabled?: boolean;
  onPress: () => void;
  accent?: Accent;
};

// コースメニューの番号付きカード (例: 1 拡大・縮小)
export function CategoryCard({ number, title, description, cleared, isNext = false, disabled = false, onPress, accent = accents.basic }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.card, isNext && { borderColor: accent.main }, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <View style={[styles.number, { backgroundColor: accent.pale }]}>
        <Text style={[styles.numberText, { color: accent.main }]}>{number}</Text>
      </View>
      <View style={styles.texts}>
        {isNext && <NextBadge />}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{disabled ? "じゅんびちゅう" : description}</Text>
      </View>
      {!disabled && <StatusMark cleared={cleared} />}
      {!disabled && <Ionicons name="chevron-forward" size={24} color={colors.textSub} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTouchSize + 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  disabled: { opacity: 0.5 },
  number: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { fontSize: fontSize.large, },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  description: { fontSize: 15, color: colors.textSub },
  pressed: { transform: [{ scale: 0.98 }] },
});
