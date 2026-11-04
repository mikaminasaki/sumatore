import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";

// コースメニュー上部の「すすみぐあい 2 / 4 クリア」
export function ProgressCard({ cleared, total }: { cleared: number; total: number }) {
  // カテゴリが多いときはピースを小さくして 3 列にする
  const pieceSize = total > 4 ? 18 : 30;
  const columns = total > 4 ? 3 : 2;
  const ratio = total === 0 ? 0 : cleared / total;

  return (
    <View style={styles.card} accessibilityLabel={`すすみぐあい ${total} こ中 ${cleared} こ クリア`}>
      <View style={[styles.pieces, { width: pieceSize * columns + 4 * (columns - 1) }]}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.piece, { width: pieceSize, height: pieceSize }, i < cleared ? styles.pieceOn : styles.pieceOff]} />
        ))}
      </View>
      <View style={styles.texts}>
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
  pieces: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  piece: { borderRadius: 4 },
  pieceOn: { backgroundColor: colors.piece },
  pieceOff: { borderWidth: 1, borderStyle: "dashed", borderColor: colors.gray },
  texts: { flex: 1 },
  count: { fontSize: fontSize.large, color: colors.text },
  countBig: { fontSize: 36, fontWeight: "bold" },
  bar: { height: 12, borderRadius: 6, backgroundColor: colors.border, marginTop: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.clearGreen },
});
