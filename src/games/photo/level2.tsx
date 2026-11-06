import { useState } from "react";
import { Image, Text, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";

import type { Game, GameProps } from "@/games/types";

import { albumStyles } from "./album-styles";
import { dogPhotoIndex, photos } from "./photos";

const album = [photos[dogPhotoIndex - 1], photos[dogPhotoIndex], photos[dogPhotoIndex + 1]];
const targets = [2, 0];

function PhotoLevel2({ step, onStepComplete }: GameProps) {
  const [index, setIndex] = useState(1);
  const swipe = usePanGesture({
    runOnJS: true,
    activeOffsetX: [-20, 20],
    failOffsetY: [-24, 24],
    onDeactivate: (event) => {
      if (event.canceled || Math.abs(event.translationX) < 40) return;
      const direction = event.translationX < 0 ? 1 : -1;
      const next = Math.max(0, Math.min(album.length - 1, index + direction));
      setIndex(next);
      if (next === targets[step]) onStepComplete();
    },
  });

  return (
    <View style={albumStyles.screen}>
      <Text accessibilityRole="header" style={albumStyles.title}>写真</Text>
      <GestureDetector gesture={swipe}>
        <View style={albumStyles.viewer}>
          <Image source={album[index]} style={albumStyles.photo} resizeMode="contain" />
        </View>
      </GestureDetector>
      <Text accessibilityLiveRegion="polite" style={albumStyles.caption}>{index + 1} / {album.length}</Text>
    </View>
  );
}

export const photo2: Game = {
  steps: [
    { instruction: "写真を 左に スワイプして、3枚目を 見ましょう", hint: "写真の 上で 指を 右から 左へ すべらせます" },
    { instruction: "写真を 右に スワイプして、1枚目に もどりましょう", hint: "写真の 上で 指を 左から 右へ すべらせます" },
  ],
  Component: PhotoLevel2,
};
