import { photo1 } from "@/games/photo/level1";
import { photo2 } from "@/games/photo/level2";
import { photo3 } from "@/games/photo/level3";
import { photo4 } from "@/games/photo/level4";
import { photo5 } from "@/games/photo/level5";
import type { Game } from "@/games/types";
import { zoom1 } from "@/games/zoom/level1";

// レベル ID (lessons.ts の id) とゲームの対応表。
// ここに無いレベルは、練習画面に「（仮）クリアする」ボタンが出る
const games: Record<string, Game> = {
  "zoom-1": zoom1,
  "photo-1": photo1,
  "photo-2": photo2,
  "photo-3": photo3,
  "photo-4": photo4,
  "photo-5": photo5,
};

export function getGame(levelId: string): Game | undefined {
  return games[levelId];
}
