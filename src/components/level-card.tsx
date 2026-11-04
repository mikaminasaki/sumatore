import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NextBadge } from "@/components/next-badge";
import { StatusMark } from "@/components/status-mark";
import { accents, colors, fontSize, minTouchSize, type Accent } from "@/constants/theme";

type Props = {
  level: number;
  cleared: boolean;
  // 次に取り組むレベルなら青枠と「つぎは ここ」を付ける
  isNext?: boolean;
  onPress: () => void;
  accent?: Accent;
};

// レベル一覧の 1 行
export function LevelCard({ level, cleared, isNext = false, onPress, accent = accents.basic }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`レベル ${level} ${cleared ? "クリア" : "まだ"}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, isNext && { borderColor: accent.main }, pressed && styles.pressed]}
    >
      <View style={[styles.image, { borderColor: accent.main, backgroundColor: accent.pale }]}>
        {/* レベルごとの画像は #7 で差し替える */}
        <Text style={[styles.imageText, { color: accent.main }]}>画像</Text>
      </View>
      <View style={styles.texts}>
        {isNext && <NextBadge />}
        <Text style={styles.level}>レベル {level}</Text>
      </View>
      <StatusMark cleared={cleared} />
      <Ionicons name="chevron-forward" size={24} color={colors.textSub} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTouchSize + 24,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: { fontSize: 14, },
  texts: { flex: 1, gap: 2 },
  level: { fontSize: fontSize.title, fontWeight: "bold", color: colors.text },
  pressed: { transform: [{ scale: 0.98 }] },
});
