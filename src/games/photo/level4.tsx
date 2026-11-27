import { useRef } from "react";

import type { Game, GameProps } from "@/games/types";

import { AlbumPrompt, PhotoAlbum } from "./album";
import { snowPhotoIndex } from "./photos";

function PhotoLevel4({ onStepComplete }: GameProps) {
  const completed = useRef(false);

  return (
    <PhotoAlbum
      initialPhoto={snowPhotoIndex}
      practiceFavoriteIndex={snowPhotoIndex}
      onFavoriteChange={(index, isFavorite) => {
        if (!completed.current && index === snowPhotoIndex && isFavorite) {
          completed.current = true;
          onStepComplete();
        }
      }}
      actions={(index, _zoomed, { isFavorite }) => {
        if (index !== snowPhotoIndex) return <AlbumPrompt>雪山の写真を開いてください。</AlbumPrompt>;
        if (isFavorite) return <AlbumPrompt>お気に入りに登録できました。</AlbumPrompt>;
        return <AlbumPrompt>右上のハートを押して、お気に入りに登録してください。</AlbumPrompt>;
      }}
    />
  );
}

export const photo4: Game = {
  steps: [{
    instruction: "雪山の写真を、お気に入りに登録しましょう。",
    hint: "右上の白いハートを1回押してください。赤くなって、お気に入りに登録できたらクリアです。",
  }],
  Component: PhotoLevel4,
};
