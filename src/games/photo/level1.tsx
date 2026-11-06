import type { Game, GameProps } from "@/games/types";

import { AlbumAction, PhotoAlbum } from "./album";
import { dogPhotoIndex } from "./photos";

function PhotoLevel1({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      referencePhoto={dogPhotoIndex}
      actions={(index) => index === dogPhotoIndex && (
        <AlbumAction title="この 写真を 見せる" onPress={onStepComplete} />
      )}
    />
  );
}

export const photo1: Game = {
  steps: [{
    instruction: "家族に、見本と 同じ 犬の 写真を 見せましょう",
    hint: "一覧を 上に すべらせて、見本と 同じ 写真を タップします",
  }],
  Component: PhotoLevel1,
};
