import type { ImageSourcePropType } from "react-native";

import type { CourseId } from "@/data/lessons";
import { pieceLayout } from "@/data/puzzle-pieces.generated";

// パズルの素材と、カテゴリごとにもらえるピースの対応。
// 画像は scripts/make-puzzle-pieces.py で assets/images/puzzles/ の素材から作る。

export type Piece = {
  categoryId: string;
  name: string; // ピースの絵の名前 (画面に出す)
  image: ImageSourcePropType;
  // 台座に対する位置と大きさ (割合)
  layout: { left: number; top: number; width: number; height: number };
};

export const boards: Record<CourseId, ImageSourcePropType> = {
  basic: require("@/../assets/images/puzzles/app/basic-board.jpg"),
  practice: require("@/../assets/images/puzzles/app/practice-board.jpg"),
};

const basicPieces: Piece[] = [
  { categoryId: "tap", name: "和牛", image: require("@/../assets/images/puzzles/app/basic-wagyu.png"), layout: pieceLayout.basic.wagyu },
  { categoryId: "swipe", name: "塩ソフト", image: require("@/../assets/images/puzzles/app/basic-salt-soft-serve.png"), layout: pieceLayout.basic["salt-soft-serve"] },
  { categoryId: "long-press", name: "お菓子", image: require("@/../assets/images/puzzles/app/basic-sweets.png"), layout: pieceLayout.basic.sweets },
  { categoryId: "typing", name: "ひじき", image: require("@/../assets/images/puzzles/app/basic-hijiki.png"), layout: pieceLayout.basic.hijiki },
  { categoryId: "zoom", name: "干物", image: require("@/../assets/images/puzzles/app/basic-dried-fish.png"), layout: pieceLayout.basic["dried-fish"] },
];

const practicePieces: Piece[] = [
  { categoryId: "message", name: "みそぎ", image: require("@/../assets/images/puzzles/app/practice-misogi.png"), layout: pieceLayout.practice.misogi },
  { categoryId: "map", name: "咸臨丸", image: require("@/../assets/images/puzzles/app/practice-kanrin-maru.png"), layout: pieceLayout.practice["kanrin-maru"] },
  { categoryId: "search", name: "新幹線", image: require("@/../assets/images/puzzles/app/practice-shinkansen.png"), layout: pieceLayout.practice.shinkansen },
  { categoryId: "ai-chat", name: "いさりび鉄道", image: require("@/../assets/images/puzzles/app/practice-isaribi-railway.png"), layout: pieceLayout.practice["isaribi-railway"] },
  { categoryId: "sns", name: "道の駅", image: require("@/../assets/images/puzzles/app/practice-roadside-station.png"), layout: pieceLayout.practice["roadside-station"] },
  { categoryId: "photo", name: "チューリップ", image: require("@/../assets/images/puzzles/app/practice-tulips.png"), layout: pieceLayout.practice.tulips },
  { categoryId: "home-screen", name: "スギ", image: require("@/../assets/images/puzzles/app/practice-cedars.png"), layout: pieceLayout.practice.cedars },
  { categoryId: "settings", name: "歴史的な 建物", image: require("@/../assets/images/puzzles/app/practice-historic-building.png"), layout: pieceLayout.practice["historic-building"] },
];

export const pieces: Record<CourseId, Piece[]> = { basic: basicPieces, practice: practicePieces };

export function getPiece(categoryId: string): Piece | undefined {
  return [...basicPieces, ...practicePieces].find((p) => p.categoryId === categoryId);
}
