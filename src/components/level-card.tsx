import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

type Props = {
  level: number;
  description: string;
  cleared: boolean;
  onPress: () => void;
};

// レベル一覧の 1 行。クリア済みは緑の背景とチェックで表示する
export function LevelCard({ level, description, cleared, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Level ${level} ${description}${cleared ? " クリア済み" : ""}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cleared ? colors.greenLight : colors.white },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.texts}>
        <Text style={styles.level}>Level {level}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons
        name={cleared ? "checkmark-circle-outline" : "ellipse-outline"}
        size={40}
        color={cleared ? colors.green : colors.gray}
      />
      <Ionicons name="chevron-forward" size={24} color={colors.textSub} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTouchSize,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.greenLight,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  texts: {
    flex: 1,
  },
  level: {
    fontSize: fontSize.large,
    fontWeight: "bold",
    color: colors.text,
  },
  description: {
    fontSize: fontSize.small,
    color: colors.textSub,
    marginTop: 2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
