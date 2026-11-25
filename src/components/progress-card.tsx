import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";

// コースメニュー上部のクリア数と進捗バー。
export function ProgressCard({ cleared, total }: { cleared: number; total: number }) {
  const ratio = total === 0 ? 0 : cleared / total;

  return (
    <View style={styles.card} accessible accessibilityLabel={`全${total}編のうち${cleared}編クリア`}>
      <View style={styles.texts}>
        <Text style={styles.count}>
          <Text style={styles.countBig}>{cleared} / {total}</Text> クリア
        </Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${ratio * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  texts: { gap: 4 },
  count: { fontSize: fontSize.large, color: colors.text },
  countBig: { fontSize: 36, fontWeight: "bold" },
  bar: { height: 12, borderRadius: 6, backgroundColor: colors.border, marginTop: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.clearGreen },
});
