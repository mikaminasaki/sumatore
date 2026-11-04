import type { Game } from "@/games/types";
import { zoom1 } from "@/games/zoom/level1";

// レベル ID (lessons.ts の id) とゲームの対応表。
// ここに無いレベルは、練習画面に「（仮）クリアする」ボタンが出る
const games: Record<string, Game> = {
  "zoom-1": zoom1,
};

export function getGame(levelId: string): Game | undefined {
  return games[levelId];
}
