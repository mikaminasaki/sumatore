import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";
import { ZoomArea } from "@/games/zoom/zoom-area";

// 写真は横 3 : 縦 2
const PHOTO_ASPECT = 3 / 2;
// 違うところ (左下の茂みで、黄色い花が 1 つだけ白い)。写真の 横 12〜15%・縦 87〜92% あたり。
// シニア向けに、まわりを少し広めに取る
const DIFFERENT_AREA = { left: "9%", top: "82%", width: "9%", height: "15%" } as const;

// 拡大・縮小編 レベル 4: 2枚の写真をそれぞれ拡大して、違うところをタップする
function ZoomLevel4({ step, onStepComplete }: GameProps) {
  // どちらかの写真を 2 倍近くまで広げたら、ステップ1 クリア
  const handlePinchEnd = (scale: number) => {
    if (step === 0 && scale >= 1.8) onStepComplete();
  };

  return (
    <View style={styles.panels}>
      {/* お手本は見るだけ。タップできるのは「探す絵」だけにする */}
      <View style={styles.section}>
        <View style={styles.panel}>
          <ZoomArea pannable minScale={1} onPinchEnd={handlePinchEnd}>
            <Image
              source={require("@/assets/images/zoom/station-a.jpg")}
              style={styles.photo}
              accessibilityLabel="お手本の写真。キーコと木古内駅の看板"
            />
          </ZoomArea>
          {/* ラベルは写真の左上に重ねて、写真をできるだけ大きく見せる */}
          <Text style={styles.label} pointerEvents="none">お手本</Text>
        </View>
      </View>
      <View style={styles.section}>
        <View style={[styles.panel, styles.panelActive]}>
          <ZoomArea pannable minScale={1} onPinchEnd={handlePinchEnd}>
            <View style={styles.photo}>
              <Image
                source={require("@/assets/images/zoom/station-b.jpg")}
                style={styles.photo}
                accessibilityLabel="探す写真。お手本と1か所だけ違います"
              />
              {/* 写真と一緒に拡大・移動するので、拡大しても同じ場所が正解になる */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="違うところ"
                onPress={() => {
                  if (step === 1) onStepComplete();
                }}
                style={[styles.different, DIFFERENT_AREA]}
              />
            </View>
          </ZoomArea>
          <Text style={[styles.label, styles.labelActive]} pointerEvents="none">探す絵</Text>
        </View>
      </View>
    </View>
  );
}

export const zoom4: Game = {
  steps: [
    {
      instruction: "どちらかの絵を大きくしましょう",
      hint: "上の絵も下の絵も、それぞれ2本の指で広げて大きくできます",
    },
    {
      instruction: "下の絵で、お手本と違うところをタップしましょう",
      hint: "上と下の絵を同じところまで大きくして、比べます。1つだけ色が違います。指1本で絵を動かせます",
    },
  ],
  Component: ZoomLevel4,
  // 写真をできるだけ大きく見せるため、練習エリアの枠を出さない
  frameless: true,
};

const styles = StyleSheet.create({
  panels: { flex: 1, alignSelf: "stretch", gap: 8 },
  section: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
    fontSize: fontSize.large,
    fontWeight: "bold",
    color: colors.white,
    backgroundColor: colors.textSub,
    overflow: "hidden",
  },
  labelActive: { backgroundColor: colors.burntOrange },
  // 高さに合わせて横 3 : 縦 2 で広げ、横幅からはみ出さないようにする
  panel: {
    flex: 1,
    aspectRatio: PHOTO_ASPECT,
    maxWidth: "100%",
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  panelActive: { borderColor: colors.burntOrange },
  photo: { width: "100%", height: "100%" },
  different: { position: "absolute" },
});
