import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { accents } from "@/constants/theme";

import { AlbumAction, AlbumPrompt } from "./album";

export function ConfirmSelection({ correct, onCorrect, retryMessage }: {
  correct: boolean;
  onCorrect: () => void;
  retryMessage: string;
}) {
  const [tryAgain, setTryAgain] = useState(false);

  return (
    <View>
      <AlbumPrompt>{tryAgain ? retryMessage : "見つけたら「この写真を選ぶ」を押してください。"}</AlbumPrompt>
      <View style={styles.confirmButton}>
        <AlbumAction title="この写真を選ぶ" onPress={correct ? onCorrect : () => setTryAgain(true)} />
      </View>
    </View>
  );
}

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
