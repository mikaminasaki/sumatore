import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { blanketDogPhotoIndex } from "./photos";

function BlanketAnswer({ correctPhoto, zoomed, onCorrect }: { correctPhoto: boolean; zoomed: boolean; onCorrect: () => void }) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function answer(isCorrect: boolean) {
    if (!correctPhoto) {
      setFeedback("毛布をかぶった犬の写真を選んでください");
    } else if (!zoomed) {
      setFeedback("2本の指を広げて、毛布を拡大してください");
    } else if (!isCorrect) {
      setFeedback("犬の顔の下にある毛布をご確認ください。線が交差していますか？");
    } else {
      onCorrect();
    }
  }

  return (
    <View>
      <AlbumPrompt>{feedback ?? "毛布はどちらの模様ですか？"}</AlbumPrompt>
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
    instruction: "犬がかぶっている毛布を拡大し、模様を確認してください",
    hint: "2本の指を広げて拡大し、1本の指で写真を動かして、犬の顔の下の毛布をご確認ください",
  }],
  Component: PhotoLevel3,
};

const styles = StyleSheet.create({
  options: { flexDirection: "row", justifyContent: "space-evenly" },
});
