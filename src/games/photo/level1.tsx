import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";

import { albumStyles } from "./album-styles";
import { dogPhotoIndex, photos } from "./photos";

function PhotoLevel1({ onStepComplete }: GameProps) {
  const [opened, setOpened] = useState<number | null>(null);

  return (
    <View style={albumStyles.screen}>
      <Text accessibilityRole="header" style={albumStyles.title}>ライブラリ</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.grid} accessibilityElementsHidden={opened !== null} importantForAccessibility={opened === null ? "auto" : "no-hide-descendants"}>
        {photos.map((photo, index) => (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={index === dogPhotoIndex ? "犬の写真" : `写真 ${index + 1}`}
            style={styles.tile}
            onPress={() => setOpened(index)}
          >
            <Image source={photo} style={albumStyles.photo} />
          </Pressable>
        ))}
      </ScrollView>
      {opened !== null && (
        <View style={styles.preview}>
          <View style={albumStyles.viewer}>
            <Image source={photos[opened]} style={albumStyles.photo} resizeMode="contain" />
          </View>
          <Text style={albumStyles.caption}>{opened === dogPhotoIndex ? "犬の 写真です" : "犬の 写真を さがしましょう"}</Text>
          <Pressable accessibilityRole="button" style={albumStyles.button} onPress={opened === dogPhotoIndex ? onStepComplete : () => setOpened(null)}>
            <Text style={albumStyles.buttonText}>{opened === dogPhotoIndex ? "できた" : "一覧に もどる"}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export const photo1: Game = {
  steps: [{
    instruction: "写真の 一覧を 下に すすんで、犬の 写真を ひらきましょう",
    hint: "指を 下から 上へ すべらせて、犬の 写真を 見つけたら タップします",
  }],
  Component: PhotoLevel1,
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 4, padding: 4 },
  tile: { width: "49%", aspectRatio: 1, overflow: "hidden", backgroundColor: colors.background },
  preview: { ...StyleSheet.absoluteFill, backgroundColor: colors.white },
});
