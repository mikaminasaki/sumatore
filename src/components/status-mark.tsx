import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

// カード右側の「✓ クリア」/「◌ まだ」表示
export function StatusMark({ cleared }: { cleared: boolean }) {
  return (
    <View style={styles.container}>
      {cleared ? (
        <Ionicons name="checkmark-circle" size={30} color={colors.clearGreen} />
      ) : (
        <View style={styles.dashedCircle} />
      )}
      <Text style={[styles.label, { color: cleared ? colors.clearGreen : colors.textSub }]}>
        {cleared ? "クリア" : "まだ"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", width: 56 },
  dashedCircle: {
    width: 26,
    height: 26,
    margin: 2,
    borderRadius: 13,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.gray,
  },
  label: { fontSize: 14, fontWeight: "bold" },
});
