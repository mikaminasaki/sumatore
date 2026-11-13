import type { Game, GameProps } from "@/games/types";

import { AlbumAction, AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel4({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={snowPhotoIndex}
      actions={(index, _zoomed, { isFavorite }) => (
        index === snowPhotoIndex && isFavorite
          ? <AlbumAction title="登録を確認して次へ" onPress={onStepComplete} />
          : <AlbumPrompt>右上のハートを押すと、お気に入りに登録できます</AlbumPrompt>
      )}
    />
  );
}

export const photo4: Game = {
  steps: [{
    instruction: "雪山の写真のハートを押して、お気に入りに登録してください",
    hint: "右上のハートが赤くなれば登録済みです。「お気に入り」の一覧から、後で写真を開けます",
  }],
  Component: PhotoLevel4,
};
