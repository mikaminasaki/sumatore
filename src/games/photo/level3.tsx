import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";

import { AlbumAction, PhotoAlbum } from "./album";
import { riverPhotoIndex } from "./photos";

function RiverAnswer({ onCorrect }: { onCorrect: () => void }) {
  const [tryAgain, setTryAgain] = useState(false);

  return (
    <View>
      <Text accessibilityLiveRegion="polite" style={styles.question}>
        {tryAgain ? "もういちど 写真を 見てみましょう" : "川の 岩の 上に あるものは？"}
      </Text>
      <View style={styles.options}>
        <AlbumAction title="木の 幹" onPress={onCorrect} />
        <AlbumAction title="赤い ボート" onPress={() => setTryAgain(true)} />
      </View>
    </View>
  );
}

function PhotoLevel3({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      zoomPhoto={riverPhotoIndex}
      actions={(index, zoomed) => index === riverPhotoIndex && zoomed && <RiverAnswer onCorrect={onStepComplete} />}
    />
  );
}

export const photo3: Game = {
  steps: [{
    instruction: "森の 川の 写真で、岩の 上に あるものを 調べましょう",
    hint: "川の 写真を 開き、2本の 指を ひろげて 大きくします",
  }],
  Component: PhotoLevel3,
};

const styles = StyleSheet.create({
  question: { paddingTop: 6, textAlign: "center", fontSize: fontSize.small, color: colors.text },
  options: { flexDirection: "row", justifyContent: "space-evenly" },
});
