import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

// 点線の丸の大きさ。iOS の borderStyle: "dashed" は丸くすると線の継ぎ目が重なるので、
// 短い線を円の上に均等に並べて描く
const SIZE = 34;
const DASH_COUNT = 12;
const DASH_LENGTH = 6;
const DASH_WIDTH = 3;
const RADIUS = (SIZE - DASH_WIDTH) / 2;

// カード右側のクリア表示 (クリア済みは ✓、まだは点線の丸)
export function StatusMark({ cleared }: { cleared: boolean }) {
  return (
    <View style={styles.container} accessibilityLabel={cleared ? "クリア" : "まだ"}>
      {cleared ? (
        <Ionicons name="checkmark-circle" size={40} color={colors.clearGreen} />
      ) : (
        <View style={styles.dashedCircle}>
          {Array.from({ length: DASH_COUNT }, (_, i) => {
            const angle = (i / DASH_COUNT) * 2 * Math.PI;
            return (
              <View
                key={i}
                style={[
                  styles.dash,
                  {
                    left: SIZE / 2 + RADIUS * Math.sin(angle) - DASH_WIDTH / 2,
                    top: SIZE / 2 - RADIUS * Math.cos(angle) - DASH_LENGTH / 2,
                    transform: [{ rotate: `${(i / DASH_COUNT) * 360 + 90}deg` }],
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", width: 48 },
  dashedCircle: { width: SIZE, height: SIZE, margin: 3 },
  dash: {
    position: "absolute",
    width: DASH_WIDTH,
    height: DASH_LENGTH,
    borderRadius: DASH_WIDTH / 2,
    backgroundColor: colors.gray,
  },
});
