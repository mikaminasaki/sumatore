import type { Game, GameProps } from "@/games/types";

import { ConfirmPhoto, PhotoAlbum } from "./album";
import { blanketDogPhotoIndex } from "./photos";

function PhotoLevel1({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      referencePhoto={blanketDogPhotoIndex}
      actions={(index) => <ConfirmPhoto key={index} correct={index === blanketDogPhotoIndex} onCorrect={onStepComplete} />}
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
