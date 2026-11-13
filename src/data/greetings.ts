import { categories, getLevelsByCategory } from "@/data/lessons";

// ホーム画面のキャラクターの吹き出しの文。文を増やすときはここに足す。
// 吹き出しで変なところで折り返さないよう、1 行は 12 文字くらいまでにして \n で改行する。
// ホームを開くたびに、時間帯の文と進み具合の文を合わせた中から 1 つをランダムに選ぶ。

type TimeOfDay = "morning" | "day" | "evening" | "night";

const timeMessages: Record<TimeOfDay, string[]> = {
  morning: [
    "おはよう！\n今日も 一緒に\n練習 しよう♪",
    "おはよう！\n朝の 練習、\n気持ちいいね♪",
    "おはよう！\n今日も 元気に いこう♪",
  ],
  day: [
    "こんにちは！\n少しずつ やってみよう♪",
    "こんにちは！\n今日は どれを\n練習 する？",
    "こんにちは！\nゆっくりで\n大丈夫だよ♪",
  ],
  evening: [
    "こんばんは！\n今日も お疲れさま♪",
    "こんばんは！\n少しだけ\n練習 しようか♪",
  ],
  night: [
    "遅くまで えらいね。\n無理せず やろうね♪",
    "こんばんは！\n寝る 前に\n少しだけ やろうか♪",
  ],
};

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// 進み具合に合わせた文 (当てはまるものだけ返す)
export function getProgressMessages(clearedLevelIds: string[]): string[] {
  const cleared = new Set(clearedLevelIds);
  const count = cleared.size;

  if (count === 0) return ["初めての 練習、\n一緒に やってみよう♪"];

  const messages = [`これまでに ${count}個\nクリア したよ！\nすごいね♪`];

  for (const category of categories) {
    const levels = getLevelsByCategory(category.id);
    const done = levels.filter((l) => cleared.has(l.id)).length;
    const left = levels.length - done;
    if (done > 0 && left > 0 && left <= 2) {
      messages.push(`${category.title}は\nあと ${left}つで\nピースが もらえるよ♪`);
    } else if (done > 0 && left > 0) {
      messages.push(`${category.title}の\n続きを やってみよう♪`);
    }
  }
  return messages;
}

export function pickGreeting(clearedLevelIds: string[], now = new Date()): string {
  const pool = [...timeMessages[getTimeOfDay(now.getHours())], ...getProgressMessages(clearedLevelIds)];
  return pool[Math.floor(Math.random() * pool.length)];
}
