import type { Game, GameProps } from "@/games/types";

import { ConfirmPhoto, PhotoAlbum } from "./album";
import { blanketDogPhotoIndex } from "./photos";

function PhotoLevel1({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      actions={(index) => <ConfirmPhoto key={index} correct={index === blanketDogPhotoIndex} onCorrect={onStepComplete} />}
    />
  );
}

export const photo1: Game = {
  steps: [{
    instruction: "見本と同じ、毛布をかぶった犬の写真を開いてください",
    hint: "上のお題にある写真が見本です。下の写真一覧を上にスクロールして、同じ犬を探してください",
  }],
  Component: PhotoLevel1,
};
