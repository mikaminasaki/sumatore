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

        return <AlbumPrompt>一覧に もどって「お気に入り」を 開きましょう</AlbumPrompt>;
      }}
    />
  );
}

export const photo5: Game = {
  steps: [{
    instruction: "お気に入りから 雪山の 写真を ひらいて、家族に 見せましょう",
    hint: "一覧の「お気に入り」を タップします。雪山の 写真が なければ、先に ハートで 登録します",
  }],
  Component: PhotoLevel5,
};
