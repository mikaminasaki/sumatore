import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";

import type { Game, GameProps } from "@/games/types";

import { AlbumPrompt, PhotoAlbum } from "./album";
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
        <Pressable accessibilityRole="button" onPress={() => answer(true)} style={({ pressed }) => [styles.answerButton, pressed && styles.answerButtonPressed]}>
          <Text style={styles.answerText}>チェック</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => answer(false)} style={({ pressed }) => [styles.answerButton, pressed && styles.answerButtonPressed]}>
          <Text style={styles.answerText}>水玉</Text>
        </Pressable>
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
  options: { flexDirection: "row", gap: 12, paddingHorizontal: 12, paddingVertical: 8 },
  answerButton: { flex: 1, minWidth: 0, minHeight: minTouchSize, paddingHorizontal: 12, paddingVertical: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: accents.practice.main, borderRadius: 12, backgroundColor: colors.white },
  answerButtonPressed: { backgroundColor: accents.practice.pale, transform: [{ scale: 0.98 }] },
  answerText: { color: accents.practice.dark, fontSize: fontSize.body, fontWeight: "bold", textAlign: "center" },
});
