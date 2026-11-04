// レッスンの定義データ。カテゴリやレベルを増やすときはここに追記する。

export type CourseId = "basic" | "practice";

export type Category = {
  id: string;
  course: CourseId;
  title: string;
};

export type Level = {
  // 進捗の保存キーにもなるので、一度決めたら変えない
  id: string;
  categoryId: string;
  level: number;
  // 練習画面の吹き出しとクリア画面に出す、そのレベルでやること
  description: string;
};

export const courses: Record<CourseId, { title: string }> = {
  basic: { title: "基本操作編" },
  practice: { title: "実践編" },
};

// カテゴリと、レベル 1〜5 でやること。並び順がメニューの表示順になる。
// レベルの id は「カテゴリ id-番号」(例: zoom-1)
const definitions: { id: string; course: CourseId; title: string; levels: string[] }[] = [
  // 基本操作編
  { id: "tap", course: "basic", title: "タップ編", levels: [
    "画面の まるを 1回 タップしよう",
    "光った ボタンを タップしよう",
    "小さな ボタンを タップしよう",
    "2回 つづけて タップしよう",
    "じゅんばんに タップしよう",
  ] },
  { id: "swipe", course: "basic", title: "スワイプ編", levels: [
    "指で 上に スワイプしよう",
    "指で 左右に スワイプして 写真を めくろう",
    "ゆっくり スワイプして ページを うごかそう",
    "目当ての 写真まで スワイプしよう",
    "長い ページを 下まで スワイプしよう",
  ] },
  { id: "long-press", course: "basic", title: "長押し編", levels: [
    "まるを 長押し しよう",
    "長押しして メニューを 出そう",
    "長押しして アイコンを うごかそう",
    "長押しして 文字を えらぼう",
    "長押しして コピーしよう",
  ] },
  { id: "typing", course: "basic", title: "文字入力編", levels: [
    "ひらがなを 1文字 入力しよう",
    "自分の 名前を 入力しよう",
    "かんじに へんかん しよう",
    "数字を 入力しよう",
    "みじかい 文を 入力しよう",
  ] },
  { id: "zoom", course: "basic", title: "拡大・縮小編", levels: [
    "画像を 拡大・縮小 してみよう",
    "指定された 大きさまで 拡大・縮小 しよう",
    "小さな 文字を 拡大して 読んでみよう",
    "拡大して まちがいを さがそう",
    "写真の 中から 指定された ものを さがそう",
  ] },
  // 実践編
  { id: "message", course: "practice", title: "ライン・メッセージアプリ編", levels: [
    "とどいた メッセージを 読もう",
    "スタンプを 送ろう",
    "みじかい メッセージを 送ろう",
    "写真を 送ろう",
    "電話を かけよう",
  ] },
  { id: "map", course: "practice", title: "地図編", levels: [
    "地図で 今いる 場所を 見よう",
    "地図を 拡大・縮小 しよう",
    "行きたい 場所を さがそう",
    "道じゅんを しらべよう",
    "近くの お店を さがそう",
  ] },
  { id: "search", course: "practice", title: "検索編", levels: [
    "検索する ところを タップしよう",
    "ことばを 入力して 検索しよう",
    "検索けっかを ひらこう",
    "天気を しらべよう",
    "声で 検索しよう",
  ] },
  { id: "ai-chat", course: "practice", title: "チャッピー編（AI）", levels: [
    "AI に あいさつ しよう",
    "AI に しつもん しよう",
    "AI に レシピを きこう",
    "AI に 文を つくって もらおう",
    "AI と おしゃべり しよう",
  ] },
  { id: "sns", course: "practice", title: "SNS編", levels: [
    "とうこうを 見よう",
    "「いいね」を おそう",
    "コメントを 読もう",
    "コメントを 書こう",
    "写真を とうこう しよう",
  ] },
  { id: "photo", course: "practice", title: "写真編", levels: [
    "カメラで 写真を とろう",
    "とった 写真を 見よう",
    "写真を 拡大しよう",
    "写真を けそう",
    "写真を 人に 送ろう",
  ] },
  { id: "home-screen", course: "practice", title: "ホーム画面編", levels: [
    "アプリを ひらこう",
    "ホーム画面に もどろう",
    "アプリを とじよう",
    "アプリを さがそう",
    "アイコンを ならべかえよう",
  ] },
  { id: "settings", course: "practice", title: "設定画面編", levels: [
    "設定を ひらこう",
    "文字を 大きくしよう",
    "画面の 明るさを かえよう",
    "音の 大きさを かえよう",
    "Wi-Fi に つなごう",
  ] },
];

export const categories: Category[] = definitions.map(({ id, course, title }) => ({ id, course, title }));

export const levels: Level[] = definitions.flatMap(({ id, levels }) =>
  levels.map((description, i) => ({ id: `${id}-${i + 1}`, categoryId: id, level: i + 1, description })),
);

export function getCategory(categoryId: string) {
  return categories.find((c) => c.id === categoryId);
}

export function getCategoriesByCourse(course: CourseId) {
  return categories.filter((c) => c.course === course);
}

export function getLevelsByCategory(categoryId: string) {
  return levels.filter((l) => l.categoryId === categoryId);
}

export function getLevel(levelId: string) {
  return levels.find((l) => l.id === levelId);
}

// 同じカテゴリの次のレベル (最後のレベルなら undefined)
export function getNextLevel(levelId: string) {
  const level = getLevel(levelId);
  if (!level) return undefined;
  return levels.find((l) => l.categoryId === level.categoryId && l.level === level.level + 1);
}
