import type { Game, GameProps } from "@/games/types";

import { PhotoAlbum } from "./album";
import { ConfirmSelection } from "./confirm-selection";
import { beachPhotoIndex, snowPhotoIndex } from "./photos";

function PhotoLevel2({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={beachPhotoIndex}
      actions={(index) => (
        <ConfirmSelection
          key={index}
          correct={index === snowPhotoIndex}
          onCorrect={onStepComplete}
          retryMessage="別の写真です。写真を左右に動かして、雪山の写真を探しましょう。"
        />
      )}
    />
  );
}

export const photo2: Game = {
  steps: [{
    instruction: "写真を左右に動かして、雪山の写真を探しましょう。",
    hint: "写真に指を置いて、左や右へ動かします。雪山の写真が見つかったら「この写真を選ぶ」を押してください。",
  }],
  Component: PhotoLevel2,
};
