import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const COLUMNS = 4;
const ICONS: IconName[] = ["flower", "leaf", "sunny", "star"];
// 左の絵は同じ模様を繰り返す。右の絵だけ、この場所が違う
const DIFFERENT_INDEX = 9;
const DIFFERENT_ICON: IconName = "heart";
const CELLS: IconName[] = Array.from({ length: COLUMNS * COLUMNS }, (_, i) => ICONS[i % ICONS.length]);

// 拡大・縮小編 レベル 4: 2枚の絵を拡大して、違うところをタップする
function ZoomLevel4({ step, onStepComplete }: GameProps) {
  const panel = (isRight: boolean) => (
    <View style={styles.panel}>
      {CELLS.map((icon, i) => {
        const different = isRight && i === DIFFERENT_INDEX;
        return (
          <Pressable
            key={i}
            accessibilityLabel={different ? "ちがう ところ" : undefined}
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
  );

  return (
    <ZoomArea
      pannable
      minScale={1}
      onPinchEnd={(scale) => {
        if (step === 0 && scale >= 1.8) onStepComplete();
      }}
    >
      <View style={styles.panels}>
        <View>
          <Text style={styles.label}>ひだり</Text>
          {panel(false)}
        </View>
        <View>
          <Text style={styles.label}>みぎ</Text>
          {panel(true)}
        </View>
      </View>
    </ZoomArea>
  );
}

export const zoom4: Game = {
  steps: [
    {
      instruction: "2まいの 絵を 大きくしましょう",
      hint: "2本の指を ひろげます",
    },
    {
      instruction: "みぎの 絵で、ひだりと ちがう ところを タップしましょう",
      hint: "指 1本で 絵を うごかして、くらべます。ひとつだけ 形が ちがいます",
    },
  ],
  Component: ZoomLevel4,
};

const styles = StyleSheet.create({
  panels: { flexDirection: "row", gap: 12 },
  label: { fontSize: 10, color: colors.textSub, textAlign: "center", marginBottom: 2 },
  panel: {
    width: 88 + 8,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  cell: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
});
