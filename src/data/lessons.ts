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
    "画面の丸を1回タップしよう",
    "光ったボタンをタップしよう",
    "小さなボタンをタップしよう",
    "2回続けてタップしよう",
    "順番にタップしよう",
  ] },
  { id: "swipe", course: "basic", title: "スワイプ編", levels: [
    "指で上にスワイプしよう",
    "指で左右にスワイプして写真をめくろう",
    "ゆっくりスワイプしてページを動かそう",
    "目当ての写真までスワイプしよう",
    "長いページを下までスワイプしよう",
  ] },
  { id: "long-press", course: "basic", title: "長押し編", levels: [
    "丸を長押ししよう",
    "長押ししてメニューを出そう",
    "長押ししてアイコンを動かそう",
    "長押しして文字を選ぼう",
    "長押ししてコピーしよう",
  ] },
  { id: "typing", course: "basic", title: "文字入力編", levels: [
    "ひらがなを1文字入力しよう",
    "自分の名前を入力しよう",
    "漢字に変換しよう",
    "数字を入力しよう",
    "短い文を入力しよう",
  ] },
  { id: "zoom", course: "basic", title: "拡大・縮小編", levels: [
    "画像を拡大・縮小してみよう",
    "指定された大きさまで拡大・縮小しよう",
    "小さな文字を拡大して読んでみよう",
    "拡大して間違いを探そう",
    "写真の中から指定されたものを探そう",
  ] },
  // 実践編
  { id: "message", course: "practice", title: "ライン・メッセージアプリ編", levels: [
    "届いたメッセージを読む",
    "スタンプを送る",
    "短いメッセージを送る",
    "写真を送る",
    "電話をかける",
  ] },
  { id: "map", course: "practice", title: "地図編", levels: [
    "地図で今いる場所を見る",
    "地図を拡大・縮小する",
    "行きたい場所を探す",
    "道順を調べる",
    "近くのお店を探す",
  ] },
  { id: "search", course: "practice", title: "検索編", levels: [
    "検索するところをタップする",
    "言葉を入力して検索する",
    "検索結果を開く",
    "天気を調べる",
    "声で検索する",
  ] },
  { id: "ai-chat", course: "practice", title: "チャッピー編（AI）", levels: [
    "AIに挨拶する",
    "AIに質問する",
    "AIにレシピを聞く",
    "AIに文を作ってもらう",
    "AIと会話する",
  ] },
  { id: "sns", course: "practice", title: "SNS編", levels: [
    "投稿を見る",
    "「いいね」を押す",
    "コメントを読む",
    "コメントを書く",
    "写真を投稿する",
  ] },
  { id: "photo", course: "practice", title: "写真編", levels: [
    "写真を探して選ぶ",
    "左右にスワイプして写真を切り替える",
    "写真を拡大する",
    "お気に入りに登録する",
    "お気に入りのアルバムを見る",
  ] },
  { id: "home-screen", course: "practice", title: "ホーム画面編", levels: [
    "アプリを開く",
    "ホーム画面に戻る",
    "アプリを閉じる",
    "アプリを探す",
    "アイコンを並べ替える",
  ] },
  { id: "settings", course: "practice", title: "設定画面編", levels: [
    "設定を開く",
    "文字を大きくする",
    "画面の明るさを変える",
    "音の大きさを変える",
    "Wi-Fiに接続する",
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
