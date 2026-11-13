import type { ImageSourcePropType } from "react-native";

// クリア画面に出すキーコの画像。クリアするたびに、この中から 1 つをランダムに選ぶ。
// 画像を増やすときは assets/images/characters/ に入れて、ここに 1 行足す。
// months を書いた画像は、その月だけ出す (1〜12 月)。書かなければ一年中出す。
type ClearCharacter = { image: ImageSourcePropType; months?: number[] };

export const clearCharacters: ClearCharacter[] = [
  { image: require("@/../assets/images/home/character.png") }, // 手をふる
  { image: require("@/../assets/images/characters/keeko-1.png") }, // 太陽とバンザイ
  { image: require("@/../assets/images/characters/keeko-2.png") }, // はっぴで応援
  { image: require("@/../assets/images/characters/keeko-3.png"), months: [7, 8] }, // 夏・うきわ
  { image: require("@/../assets/images/characters/keeko-4.png") }, // 冬・雪だるま
  { image: require("@/../assets/images/characters/keeko-5.png") }, // 新幹線
  { image: require("@/../assets/images/characters/keeko-6.png") }, // はちまき・炎
  { image: require("@/../assets/images/characters/keeko-7.png") }, // キラキラ
];

export function pickClearCharacter(now = new Date()): ImageSourcePropType {
  const month = now.getMonth() + 1;
  const pool = clearCharacters.filter((c) => !c.months || c.months.includes(month));
  return pool[Math.floor(Math.random() * pool.length)].image;
}
