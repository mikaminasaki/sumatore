import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

// カード右側のクリア表示 (クリア済みは ✓、まだは点線の丸)
export function StatusMark({ cleared }: { cleared: boolean }) {
  return (
    <View style={styles.container} accessibilityLabel={cleared ? "クリア" : "まだ"}>
      {cleared ? (
        <Ionicons name="checkmark-circle" size={40} color={colors.clearGreen} />
      ) : (
        <View style={styles.dashedCircle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", width: 48 },
  dashedCircle: {
    width: 34,
    height: 34,
    margin: 3,
    borderRadius: 17,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: colors.gray,
  },
});
