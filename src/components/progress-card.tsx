import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";

// コースメニュー上部の「すすみぐあい 2 / 4 クリア」
export function ProgressCard({ cleared, total }: { cleared: number; total: number }) {
  const ratio = total === 0 ? 0 : cleared / total;

  return (
    <View style={styles.card} accessibilityLabel={`すすみぐあい ${total} こ中 ${cleared} こ クリア`}>
      <View style={styles.pieces}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.piece, i < cleared ? styles.pieceOn : styles.pieceOff]} />
        ))}
      </View>
      <View style={styles.texts}>
        <Text style={styles.label}>すすみぐあい</Text>
        <Text style={styles.count}>
          <Text style={styles.countBig}>{cleared}</Text> / {total} クリア
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
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pieces: { width: 52, flexDirection: "row", flexWrap: "wrap", gap: 4 },
  piece: { width: 24, height: 24, borderRadius: 4 },
  pieceOn: { backgroundColor: colors.piece },
  pieceOff: { borderWidth: 1, borderStyle: "dashed", borderColor: colors.gray },
  texts: { flex: 1 },
  label: { fontSize: 14, color: colors.textSub },
  count: { fontSize: fontSize.body, color: colors.text },
  countBig: { fontSize: fontSize.title, fontWeight: "bold" },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.clearGreen },
});
