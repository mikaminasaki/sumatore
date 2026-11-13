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
    instruction: "雪が積もった山の写真を選んで、家族に見せてください",
    hint: "草原の写真から左に数枚めくり、雪山の写真を探してください",
  }],
  Component: PhotoLevel2,
};
