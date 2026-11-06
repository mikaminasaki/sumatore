import type { Game } from "@/games/types";
import { zoom1 } from "@/games/zoom/level1";
import { zoom2 } from "@/games/zoom/level2";
import { zoom3 } from "@/games/zoom/level3";
import { zoom4 } from "@/games/zoom/level4";
import { zoom5 } from "@/games/zoom/level5";

// レベル ID (lessons.ts の id) とゲームの対応表。
// ここに無いレベルは、練習画面に「（仮）クリアする」ボタンが出る
const games: Record<string, Game> = {
  "zoom-1": zoom1,
  "zoom-2": zoom2,
  "zoom-3": zoom3,
  "zoom-4": zoom4,
  "zoom-5": zoom5,
};

export function getGame(levelId: string): Game | undefined {
  return games[levelId];
}
