import type { Game, GameProps } from "@/games/types";

import { AlbumAction, PhotoAlbum } from "./album";
import { dogPhotoIndex, snowPhotoIndex } from "./photos";

function PhotoLevel2({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={dogPhotoIndex}
      actions={(index) => index === snowPhotoIndex && (
        <AlbumAction title="この 写真を 見せる" onPress={onStepComplete} />
      )}
    />
  );
}

export const photo2: Game = {
  steps: [{
    instruction: "犬の 写真の 近くに ある、雪山の 写真も 見せましょう",
    hint: "写真を 左に めくるか、下に ある 小さな 写真を タップします",
  }],
  Component: PhotoLevel2,
};
