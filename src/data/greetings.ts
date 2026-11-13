import { categories, getLevelsByCategory } from "@/data/lessons";

// ホーム画面のキャラクターの吹き出しの文。文を増やすときはここに足す。
// 吹き出しで変なところで折り返さないよう、1 行は 12 文字くらいまでにして \n で改行する。
// 漢字まじりなので、言葉の間にスペースは入れない。
// ホームを開くたびに、時間帯の文と進み具合の文を合わせた中から 1 つをランダムに選ぶ。

type TimeOfDay = "morning" | "day" | "evening" | "night";

const timeMessages: Record<TimeOfDay, string[]> = {
  morning: [
    "おはよう！\n今日も一緒に練習しよう♪",
    "おはよう！\n朝の練習、\n気持ちいいね♪",
    "おはよう！\n今日も元気にいこう♪",
  ],
  day: [
    "こんにちは！\n少しずつやってみよう♪",
    "こんにちは！\n今日はどれを練習する？",
    "こんにちは！\nゆっくりで大丈夫だよ♪",
  ],
  evening: [
    "こんばんは！\n今日もお疲れさま♪",
    "こんばんは！\n少しだけ練習しようか♪",
  ],
  night: [
    "遅くまでえらいね。\n無理せずやろうね♪",
    "こんばんは！\n寝る前に少しだけやろうか♪",
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

  if (count === 0) return ["初めての練習、\n一緒にやってみよう♪"];

  const messages = [`これまでに${count}個\nクリアしたよ！\nすごいね♪`];

  for (const category of categories) {
    const levels = getLevelsByCategory(category.id);
    const done = levels.filter((l) => cleared.has(l.id)).length;
    const left = levels.length - done;
    if (done > 0 && left > 0 && left <= 2) {
      messages.push(`${category.title}は\nあと${left}つで\nピースがもらえるよ♪`);
    } else if (done > 0 && left > 0) {
      messages.push(`${category.title}の\n続きをやってみよう♪`);
    }
  }
  return messages;
}

export function pickGreeting(clearedLevelIds: string[], now = new Date()): string {
  const pool = [...timeMessages[getTimeOfDay(now.getHours())], ...getProgressMessages(clearedLevelIds)];
  return pool[Math.floor(Math.random() * pool.length)];
}
