import { StyleSheet, Text } from "react-native";

import { colors } from "@/constants/theme";

// 次に取り組むカードに付ける「つぎは ここ」バッジ
export function NextBadge() {
  return <Text style={styles.badge}>つぎは ここ</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.burntOrange,
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
