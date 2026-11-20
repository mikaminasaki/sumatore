import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { accents } from "@/constants/theme";
import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel4({ onStepComplete }: GameProps) {
  const [registered, setRegistered] = useState(false);

  return (
    <PhotoAlbum
      initialPhoto={snowPhotoIndex}
      practiceFavoriteIndex={snowPhotoIndex}
      onFavoriteChange={(index, isFavorite) => {
        if (index === snowPhotoIndex) setRegistered(isFavorite);
      }}
      actions={(index, _zoomed, { isFavorite }) => {
        if (index !== snowPhotoIndex) return <AlbumPrompt>雪山の写真を開いてください。</AlbumPrompt>;
        if (isFavorite && registered) {
          return (
            <View>
              <AlbumPrompt>登録できました。「登録を確認して次へ」を押してください。</AlbumPrompt>
              <View style={styles.confirmButton}>
                <AlbumAction title="登録を確認して次へ" onPress={onStepComplete} />
              </View>
            </View>
          );
        }
        return <AlbumPrompt>右上のハートを押して、お気に入りに登録してください。</AlbumPrompt>;
      }}
    />
  );
}

export const photo4: Game = {
  steps: [{
    instruction: "雪山の写真を、お気に入りに登録しましょう。",
    hint: "右上の白いハートを1回押してください。赤くなれば登録済みです。登録できたら「登録を確認して次へ」を押してください。",
  }],
  Component: PhotoLevel4,
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
