// クリア画面の大きな見出し。クリアするたびに、この中から 1 つをランダムに選ぶ。
// 文を増やすときはここに足す (画面の幅に収まるよう、8 文字くらいまで)。
export const praises = ["クリア！", "よく できました！", "すごい！", "やったね！", "じょうず！", "その ちょうし！"];

export function pickPraise(): string {
  return praises[Math.floor(Math.random() * praises.length)];
}
