import type { Game, GameProps } from "@/games/types";

import { PhotoAlbum } from "./album";
import { ConfirmSelection } from "./confirm-selection";
import { blanketDogPhotoIndex } from "./photos";

function PhotoLevel1({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      actions={(index) => (
        <ConfirmSelection
          key={index}
          correct={index === blanketDogPhotoIndex}
          onCorrect={onStepComplete}
          retryMessage="見本とは別の写真です。「一覧へ」で戻り、同じ写真を探しましょう。"
        />
      )}
    />
  );
}

export const photo1: Game = {
  steps: [{
    instruction: "見本と同じ写真を選びましょう。",
    hint: "上のお題にある写真が見本です。一覧を上にスクロールして同じ写真を押し、開いたら下の「この写真を選ぶ」を押してください。",
  }],
  Component: PhotoLevel1,
};
