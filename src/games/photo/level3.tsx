import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { blanketDogPhotoIndex } from "./photos";

function BlanketAnswer({ correctPhoto, zoomed, onCorrect }: { correctPhoto: boolean; zoomed: boolean; onCorrect: () => void }) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function answer(isCorrect: boolean) {
    if (!correctPhoto) {
      setFeedback("毛布を かぶった 犬の 写真を 見てみましょう");
    } else if (!zoomed) {
      setFeedback("2本の 指を ひろげて、毛布を 大きくしてみましょう");
    } else if (!isCorrect) {
      setFeedback("犬の 顔の 下を 見ましょう。線が 交わっていますか？");
    } else {
      onCorrect();
    }
  }

  return (
    <View>
      <AlbumPrompt>{feedback ?? "毛布は どちらの もようですか？"}</AlbumPrompt>
      <View style={styles.options}>
        <AlbumAction title="チェック" onPress={() => answer(true)} />
        <AlbumAction title="水玉" onPress={() => answer(false)} />
      </View>
    </View>
  );
}

function PhotoLevel3({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={blanketDogPhotoIndex}
      allowZoom
      actions={(index, zoomed) => (
        <BlanketAnswer key={index} correctPhoto={index === blanketDogPhotoIndex} zoomed={zoomed} onCorrect={onStepComplete} />
      )}
    />
  );
}

export const photo3: Game = {
  steps: [{
    instruction: "犬が かぶっている 毛布の もようを 調べましょう",
    hint: "2本の 指を ひろげ、指1本で 動かして 犬の 顔の 下に ある 毛布を 見ましょう",
  }],
  Component: PhotoLevel3,
};

const styles = StyleSheet.create({
  options: { flexDirection: "row", justifyContent: "space-evenly" },
});
