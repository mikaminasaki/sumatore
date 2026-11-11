import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel4({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={snowPhotoIndex}
      actions={(index, _zoomed, { isFavorite }) => (
        index === snowPhotoIndex && isFavorite
          ? <AlbumAction title="お気に入りに 登録できた" onPress={onStepComplete} />
          : <AlbumPrompt>右上の ハートを 押すと、お気に入りに 登録できます</AlbumPrompt>
      )}
    />
  );
}

export const photo4: Game = {
  steps: [{
    instruction: "雪山の 写真の ハートを 押して、お気に入りに 登録しましょう",
    hint: "右上の ハートが 赤く なれば 登録できています。「お気に入り」の 一覧で あとから 見られます",
  }],
  Component: PhotoLevel4,
};
