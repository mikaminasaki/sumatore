import type { ImageSourcePropType } from "react-native";

// クリア画面に出すキーコの画像。クリアするたびに、この中から 1 つをランダムに選ぶ。
// 画像を増やすときは assets/images/characters/ に入れて、ここに 1 行足す。
export const clearCharacters: ImageSourcePropType[] = [
  require("@/../assets/images/home/character.png"), // 手をふる
  require("@/../assets/images/characters/keeko-1.png"), // 太陽とバンザイ
  require("@/../assets/images/characters/keeko-2.png"), // はっぴで応援
  require("@/../assets/images/characters/keeko-3.png"), // 夏・うきわ
  require("@/../assets/images/characters/keeko-4.png"), // 冬・雪だるま
  require("@/../assets/images/characters/keeko-5.png"), // 新幹線
  require("@/../assets/images/characters/keeko-6.png"), // はちまき・炎
  require("@/../assets/images/characters/keeko-7.png"), // キラキラ
];

export function pickClearCharacter(): ImageSourcePropType {
  return clearCharacters[Math.floor(Math.random() * clearCharacters.length)];
}
