import type { Game, GameProps } from "@/games/types";

import { AlbumPrompt, ConfirmPhoto, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel5({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      actions={(index, _zoomed, { isFavorite, fromFavorites }) => {
        if (fromFavorites) {
          return <ConfirmPhoto key={index} correct={index === snowPhotoIndex && isFavorite} onCorrect={onStepComplete} />;
        }

        return <AlbumPrompt>一覧に戻り、「お気に入り」を開いてください</AlbumPrompt>;
      }}
    />
  );
}

export const photo5: Game = {
  steps: [{
    instruction: "「お気に入り」から雪山の写真を開いて、家族に見せてください",
    hint: "一覧の「お気に入り」をタップしてください。雪山の写真がない場合は、先にハートを押して登録してください",
  }],
  Component: PhotoLevel5,
};
