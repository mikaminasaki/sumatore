import { useRef } from "react";

import type { Game, GameProps } from "@/games/types";

import { AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel5({ onStepComplete }: GameProps) {
  const completed = useRef(false);

  return (
    <PhotoAlbum
      onPhotoOpen={(index, { isFavorite, fromFavorites }) => {
        if (!completed.current && fromFavorites && isFavorite && index === snowPhotoIndex) {
          completed.current = true;
          onStepComplete();
        }
      }}
      actions={(index, _zoomed, { isFavorite, fromFavorites }) => {
        if (fromFavorites) {
          return <AlbumPrompt>{index === snowPhotoIndex && isFavorite ? "雪山の写真を開けました。" : "雪山の写真を探して開いてください。"}</AlbumPrompt>;
        }

        return <AlbumPrompt>一覧へ戻り、「お気に入り」から雪山の写真を開いてください。</AlbumPrompt>;
      }}
    />
  );
}

export const photo5: Game = {
  steps: [{
    instruction: "「お気に入り」から雪山の写真を開きましょう。",
    hint: "「お気に入り」で雪山の写真を押すとクリアです。写真がない場合は「全ての写真」で雪山を開き、ハートで登録してから一覧へ戻ります。",
  }],
  Component: PhotoLevel5,
};
