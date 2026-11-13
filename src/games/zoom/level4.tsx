import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const COLUMNS = 4;
const ICONS: IconName[] = ["flower", "leaf", "sunny", "star"];
// 2枚とも同じ模様。「探す絵」だけ、この場所が違う
const DIFFERENT_INDEX = 9;
const DIFFERENT_ICON: IconName = "heart";
const CELLS: IconName[] = Array.from({ length: COLUMNS * COLUMNS }, (_, i) => ICONS[i % ICONS.length]);

// 拡大・縮小編 レベル 4: 2枚の絵を拡大して、違うところをタップする
function ZoomLevel4({ step, onStepComplete }: GameProps) {
  return (
    <ZoomArea
      pannable
      minScale={1}
      onPinchEnd={(scale) => {
        if (step === 0 && scale >= 1.8) onStepComplete();
      }}
    >
      <View style={styles.panels}>
        {/* おてほんは見るだけ。タップできるのは「探す絵」だけにする */}
        <View>
          <Text style={styles.label}>お手本</Text>
          <View style={styles.panel}>
            {CELLS.map((icon, i) => (
              <View key={i} style={styles.cell}>
                <Ionicons name={icon} size={14} color={colors.clearGreen} />
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={[styles.label, styles.labelActive]}>探す絵</Text>
          <View style={[styles.panel, styles.panelActive]}>
            {CELLS.map((icon, i) => {
              const different = i === DIFFERENT_INDEX;
              return (
                <Pressable
                  key={i}
                  accessibilityLabel={different ? "違う ところ" : undefined}
                  onPress={() => {
                    if (different && step === 1) onStepComplete();
                  }}
                  style={styles.cell}
                >
                  <Ionicons name={different ? DIFFERENT_ICON : icon} size={14} color={colors.clearGreen} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ZoomArea>
  );
}

export const zoom4: Game = {
  steps: [
    {
      instruction: "2枚の 絵を 大きくしましょう",
      hint: "2本の指を 広げます",
    },
    {
      instruction: "色の 枠の 絵で、お手本と 違う ところを タップしましょう",
      hint: "指 1本で 絵を 動かして、比べます。1つだけ 形が 違います。お手本は 見るだけです",
    },
  ],
  Component: ZoomLevel4,
};

const styles = StyleSheet.create({
  panels: { flexDirection: "row", gap: 12 },
  label: { fontSize: 10, color: colors.textSub, textAlign: "center", marginBottom: 2 },
  labelActive: { color: colors.burntOrange, fontWeight: "bold" },
  panel: {
    width: 88 + 12,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  panelActive: { borderColor: colors.burntOrange },
  cell: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
});
