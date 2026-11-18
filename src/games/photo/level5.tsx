import type { Game, GameProps } from "@/games/types";

import { AlbumPrompt, PhotoAlbum } from "./album";
import { ConfirmSelection } from "./confirm-selection";
import { snowPhotoIndex } from "./photos";

function PhotoLevel5({ onStepComplete }: GameProps) {
  return (
    <PhotoAlbum
      actions={(index, _zoomed, { isFavorite, fromFavorites }) => {
        if (fromFavorites) {
          return (
            <ConfirmSelection
              key={index}
              correct={index === snowPhotoIndex && isFavorite}
              onCorrect={onStepComplete}
              retryMessage="別の写真です。「お気に入り」から雪山の写真を探しましょう。"
            />
          );
        }

        return <AlbumPrompt>一覧へ戻り、「お気に入り」から雪山の写真を開いてください。</AlbumPrompt>;
      }}
    />
  );
}

export const photo5: Game = {
  steps: [{
    instruction: "「お気に入り」を開いて、雪山の写真を探しましょう。",
    hint: "一覧の「お気に入り」をタップしてください。雪山の写真がない場合は、先にハートを押して登録してください。見つけたら「この写真を選ぶ」を押してください。",
  }],
  Component: PhotoLevel5,
};
