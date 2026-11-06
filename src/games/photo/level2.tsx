import type { Game, GameProps } from "@/games/types";

import { ConfirmPhoto, PhotoAlbum } from "./album";
import { meadowPhotoIndex, snowPhotoIndex } from "./photos";

function PhotoLevel2({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={meadowPhotoIndex}
      actions={(index) => <ConfirmPhoto key={index} correct={index === snowPhotoIndex} onCorrect={onStepComplete} />}
    />
  );
}

export const photo2: Game = {
  steps: [{
    instruction: "家族に、雪が つもった 山の 写真を 見せましょう",
    hint: "草原の 写真から 左に 何枚か めくって、白い 山を さがします",
  }],
  Component: PhotoLevel2,
};
