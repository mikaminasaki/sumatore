import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel4({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={snowPhotoIndex}
      actions={(index, _zoomed, { isFavorite }) => (
        index === snowPhotoIndex && isFavorite
          ? <AlbumAction title="登録を 確認する" onPress={onStepComplete} />
          : <AlbumPrompt>雪山の 写真を お気に入りに 入れましょう</AlbumPrompt>
      )}
    />
  );
}

export const photo4: Game = {
  steps: [{
    instruction: "雪山の 写真を、あとで すぐ 見られるように しましょう",
    hint: "雪山の 写真を 開いたら、右上の ハートを タップします",
  }],
  Component: PhotoLevel4,
};
