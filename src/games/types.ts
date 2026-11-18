import type { ComponentType } from "react";

// 練習エリアに重ねる「指の動かし方の案内」の種類 (src/games/gesture-guide.tsx)
// pinch-out: 2本の指で広げる / pinch-in: 2本の指で縮める / pan: 指1本で動かす / tap: 指1本で押す
export type GestureGuideType = "pinch-out" | "pinch-in" | "pan" | "tap";

// ゲーム 1 つ分の決まりごと。新しいゲームを作るときは src/games/README.md を読む

export type GameStep = {
  // 吹き出しに出す、そのステップでやること
  instruction: string;
  // 「ヒントを 見る」を押したときに出す文
  hint: string;
  // そのステップで出す指の動かし方の案内。基本操作編は毎回、実践編はヒントを開いたときに出る
  guide?: GestureGuideType;
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
