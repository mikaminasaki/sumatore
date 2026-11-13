import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const COLUMNS = 8;
const ROWS = 10;
const ICONS: IconName[] = ["leaf", "flower", "rose", "nutrition"];
const TARGET_INDEX = 53;
const CELLS: IconName[] = Array.from({ length: COLUMNS * ROWS }, (_, i) => ICONS[(i * 3 + (i % 5)) % ICONS.length]);

// 拡大・縮小編 レベル 5: 絵の中から指定されたものをさがす
function ZoomLevel5({ step, onStepComplete }: GameProps) {
  return (
    <ZoomArea
      pannable
      minScale={1}
      onPinchEnd={(scale) => {
        if (step === 0 && scale >= 1.8) onStepComplete();
      }}
    >
      {/* 写真は #7 で差し替える */}
      <View style={styles.scene}>
        {CELLS.map((icon, i) => {
          const isTarget = i === TARGET_INDEX;
          return (
            <Pressable
              key={i}
              accessibilityLabel={isTarget ? "猫の足あと" : undefined}
              onPress={() => {
                if (isTarget && step === 1) onStepComplete();
              }}
              style={styles.cell}
            >
              <Ionicons name={isTarget ? "paw" : icon} size={14} color={colors.clearGreen} />
            </Pressable>
          );
        })}
      </View>
    </ZoomArea>
  );
}

export const zoom5: Game = {
  steps: [
    {
      instruction: "お庭の絵を大きくしましょう",
      hint: "2本の指を広げます",
    },
    {
      instruction: "猫の足あとを探して、タップしましょう",
      hint: "指1本で絵を動かして探します。指の跡が4つ並んだ形です",
    },
  ],
  Component: ZoomLevel5,
};

const styles = StyleSheet.create({
  scene: {
    width: 8 * 26 + 8,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  cell: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },
});
