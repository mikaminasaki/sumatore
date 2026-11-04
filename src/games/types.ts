import type { ComponentType } from "react";

// ゲーム 1 つ分の決まりごと。新しいゲームを作るときは src/games/README.md を読む

export type GameStep = {
  // 吹き出しに出す、そのステップでやること
  instruction: string;
  // 「ヒントを 見る」を押したときに出す文
  hint: string;
};

// 練習画面からゲームに渡されるもの
export type GameProps = {
  // 今のステップ (0 から数える)
  step: number;
  // そのステップができたら呼ぶ。最後のステップで呼ぶとクリア画面に進む
  onStepComplete: () => void;
};

export type Game = {
  steps: GameStep[];
  Component: ComponentType<GameProps>;
};
