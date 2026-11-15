import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

// 写真は横 3 : 縦 2
const PHOTO_WIDTH = 300;
const PHOTO_HEIGHT = 200;
// 違うところ (左下の茂みで、黄色い花が 1 つだけ白い)。写真の 横 12〜15%・縦 87〜92% あたり。
// シニア向けに、まわりを少し広めに取る
const DIFFERENT_AREA = { left: "9%", top: "82%", width: "9%", height: "15%" } as const;

// 拡大・縮小編 レベル 4: 2枚の写真を拡大して、違うところをタップする
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
        {/* お手本は見るだけ。タップできるのは「探す絵」だけにする */}
        <View>
          <Text style={styles.label}>お手本</Text>
          <View style={styles.panel}>
            <Image
              source={require("@/assets/images/zoom/station-a.jpg")}
              style={styles.photo}
              accessibilityLabel="お手本の写真。キーコと木古内駅の看板"
            />
          </View>
        </View>
        <View>
          <Text style={[styles.label, styles.labelActive]}>探す絵</Text>
          <View style={[styles.panel, styles.panelActive]}>
            <Image
              source={require("@/assets/images/zoom/station-b.jpg")}
              style={styles.photo}
              accessibilityLabel="探す写真。お手本と1か所だけ違います"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="違うところ"
              onPress={() => {
                if (step === 1) onStepComplete();
              }}
              style={[styles.different, DIFFERENT_AREA]}
            />
          </View>
        </View>
      </View>
    </ZoomArea>
  );
}

export const zoom4: Game = {
  steps: [
    {
      instruction: "2枚の絵を大きくしましょう",
      hint: "2本の指を広げます",
    },
    {
      instruction: "下の絵で、お手本と違うところをタップしましょう",
      hint: "指1本で絵を動かして、比べます。1つだけ色が違います。お手本は見るだけです",
    },
  ],
  Component: ZoomLevel4,
};

const styles = StyleSheet.create({
  panels: { gap: 8 },
  label: { fontSize: 12, color: colors.textSub, textAlign: "center", marginBottom: 2 },
  labelActive: { color: colors.burntOrange, fontWeight: "bold" },
  photo: { width: PHOTO_WIDTH, height: PHOTO_HEIGHT },
  panel: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
  },
  panelActive: { borderColor: colors.burntOrange },
  different: { position: "absolute" },
});
