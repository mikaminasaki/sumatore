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
    instruction: "下の 見本と 同じ、毛布を かぶった 犬の 写真を ひらきましょう",
    hint: "オレンジの 枠が 見本です。その下の 写真一覧を 上に すべらせて、同じ 犬を さがします",
  }],
  Component: PhotoLevel1,
};
