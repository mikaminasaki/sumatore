import type { Game, GameProps } from "@/games/types";

import { PhotoAlbum } from "./album";
import { ConfirmSelection } from "./confirm-selection";
import { meadowPhotoIndex, snowPhotoIndex } from "./photos";

function PhotoLevel2({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      initialPhoto={meadowPhotoIndex}
      actions={(index) => (
        <ConfirmSelection
          key={index}
          correct={index === snowPhotoIndex}
          onCorrect={onStepComplete}
          retryMessage="別の写真です。左右にめくって、雪山の写真を探しましょう。"
        />
      )}
    />
  );
}

export const photo2: Game = {
  steps: [{
    instruction: "写真を左右にめくって、雪山の写真を探しましょう。",
    hint: "写真の上に指を置き、左右どちらかに滑らせると、前後の写真が見られます。見つけたら「この写真を選ぶ」を押してください。",
  }],
  Component: PhotoLevel2,
};
