import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { riverPhotoIndex } from "./photos";

function RiverAnswer({ correctPhoto, zoomed, onCorrect }: { correctPhoto: boolean; zoomed: boolean; onCorrect: () => void }) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function answer(isCorrect: boolean) {
    if (!zoomed) {
      setFeedback("写真を 大きくして、よく 見てみましょう");
    } else if (!correctPhoto || !isCorrect) {
      setFeedback("森の 川の 写真を、もういちど 見てみましょう");
    } else {
      onCorrect();
    }
  }

  return (
    <View>
      <AlbumPrompt>{feedback ?? "川の 岩の 上に あるものは？"}</AlbumPrompt>
      <View style={styles.options}>
        <AlbumAction title="木の 幹" onPress={() => answer(true)} />
        <AlbumAction title="赤い ボート" onPress={() => answer(false)} />
      </View>
    </View>
  );
}

function PhotoLevel3({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      allowZoom
      actions={(index, zoomed) => (
        <RiverAnswer key={index} correctPhoto={index === riverPhotoIndex} zoomed={zoomed} onCorrect={onStepComplete} />
      )}
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
  options: { flexDirection: "row", justifyContent: "space-evenly" },
});
