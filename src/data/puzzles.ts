import type { ImageSourcePropType } from "react-native";

import type { CourseId } from "@/data/lessons";

// パズルの素材と、カテゴリごとにもらえるピースの対応。
// 画像は assets/images/puzzles/ (相方の素材)。台座もピースも 1024×1024 で、同じ位置に重ねるだけで はまる。

export type Piece = {
  categoryId: string;
  name: string; // ピースの絵の名前 (画面に出す)
  // 台座と同じ大きさの透明 PNG
  image: ImageSourcePropType;
};

export const boards: Record<CourseId, ImageSourcePropType> = {
  basic: require("@/../assets/images/puzzles/basic-empty-preview.png"),
  practice: require("@/../assets/images/puzzles/practice-empty-preview.png"),
};

const basicPieces: Piece[] = [
  { categoryId: "tap", name: "和牛", image: require("@/../assets/images/puzzles/basic-pieces/wagyu.png") },
  { categoryId: "swipe", name: "塩ソフト", image: require("@/../assets/images/puzzles/basic-pieces/salt-soft-serve.png") },
  { categoryId: "long-press", name: "お菓子", image: require("@/../assets/images/puzzles/basic-pieces/sweets.png") },
  { categoryId: "typing", name: "ひじき", image: require("@/../assets/images/puzzles/basic-pieces/hijiki.png") },
  { categoryId: "zoom", name: "干物", image: require("@/../assets/images/puzzles/basic-pieces/dried-fish.png") },
];

const practicePieces: Piece[] = [
  { categoryId: "message", name: "みそぎ", image: require("@/../assets/images/puzzles/practice-pieces/misogi.png") },
  { categoryId: "map", name: "咸臨丸", image: require("@/../assets/images/puzzles/practice-pieces/kanrin-maru.png") },
  { categoryId: "search", name: "新幹線", image: require("@/../assets/images/puzzles/practice-pieces/shinkansen.png") },
  { categoryId: "ai-chat", name: "いさりび鉄道", image: require("@/../assets/images/puzzles/practice-pieces/isaribi-railway.png") },
  { categoryId: "sns", name: "道の駅", image: require("@/../assets/images/puzzles/practice-pieces/roadside-station.png") },
  { categoryId: "photo", name: "チューリップ", image: require("@/../assets/images/puzzles/practice-pieces/tulips.png") },
  { categoryId: "home-screen", name: "スギ", image: require("@/../assets/images/puzzles/practice-pieces/cedars.png") },
  { categoryId: "settings", name: "歴史的な 建物", image: require("@/../assets/images/puzzles/practice-pieces/historic-building.png") },
];

export const pieces: Record<CourseId, Piece[]> = { basic: basicPieces, practice: practicePieces };

export function getPiece(categoryId: string): Piece | undefined {
  return [...basicPieces, ...practicePieces].find((p) => p.categoryId === categoryId);
}
