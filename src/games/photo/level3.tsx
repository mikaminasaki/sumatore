import { useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { GestureDetector, usePinchGesture } from "react-native-gesture-handler";

import type { Game, GameProps } from "@/games/types";

import { albumStyles } from "./album-styles";
import { dogPhotoIndex, photos } from "./photos";

function PhotoLevel3({ onStepComplete }: GameProps) {
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const base = useRef(1);
  const latest = useRef(1);
  const pinch = usePinchGesture({
    runOnJS: true,
    onUpdate: (event) => {
      const next = Math.max(1, Math.min(3, base.current * event.scale));
      latest.current = next;
      setScale(next);
    },
    onDeactivate: () => {
      base.current = latest.current;
      setReady(latest.current >= 1.6);
    },
  });

  return (
    <View style={albumStyles.screen}>
      <Text accessibilityRole="header" style={albumStyles.title}>写真</Text>
      <GestureDetector gesture={pinch}>
        <View style={albumStyles.viewer}>
          <Image source={photos[dogPhotoIndex]} accessibilityLabel="犬の写真" style={[albumStyles.photo, { transform: [{ scale }] }]} resizeMode="contain" />
        </View>
      </GestureDetector>
      {ready && (
        <Pressable accessibilityRole="button" style={albumStyles.button} onPress={onStepComplete}>
          <Text style={albumStyles.buttonText}>できた</Text>
        </Pressable>
      )}
    </View>
  );
}

export const photo3: Game = {
  steps: [{
    instruction: "2本の 指を ひろげて、犬の 写真を 大きくしましょう",
    hint: "親指と 人さし指を 写真に おいて、ゆっくり はなします",
  }],
  Component: PhotoLevel3,
};
