import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { accents } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { meadowPhotoIndex, snowPhotoIndex } from "./photos";

function ConfirmSnowPhoto({ correct, onCorrect }: { correct: boolean; onCorrect: () => void }) {
  const [tryAgain, setTryAgain] = useState(false);

  return (
    <View>
      <AlbumPrompt>{tryAgain
        ? "別の写真です。左右にめくって、雪山の写真を探しましょう。"
        : "見つけたら「この写真を選ぶ」を押してください。"}</AlbumPrompt>
      <View style={styles.confirmButton}>
        <AlbumAction title="この写真を選ぶ" onPress={correct ? onCorrect : () => setTryAgain(true)} />
      </View>
    </View>
  );
}

function PhotoLevel2({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={meadowPhotoIndex}
      actions={(index) => <ConfirmSnowPhoto key={index} correct={index === snowPhotoIndex} onCorrect={onStepComplete} />}
    />
  );
}

export const photo2: Game = {
  steps: [{
    instruction: "写真を左右にめくって、雪山の写真を探しましょう。",
    hint: "写真の上に指を置き、左右どちらかに滑らせると、前後の写真が見られます。見つけたら「この写真を選ぶ」を押してください。",
  }],
  Component: PhotoLevel2,
};

const styles = StyleSheet.create({
  confirmButton: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: accents.practice.main,
    borderRadius: 12,
    backgroundColor: accents.practice.pale,
  },
});
