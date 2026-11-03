// レッスンの定義データ。カテゴリやレベルを増やすときはここに追記する。

export type CourseId = "basic" | "practice";

export type Category = {
  id: string;
  course: CourseId;
  title: string;
  // false のカテゴリはメニューに「準備中」と表示する
  available: boolean;
};

export type Level = {
  // 進捗の保存キーにもなるので、一度決めたら変えない
  id: string;
  categoryId: string;
  level: number;
  description: string;
};

export const courses: Record<CourseId, { title: string }> = {
  basic: { title: "基本操作編" },
  practice: { title: "実践編" },
};

export const categories: Category[] = [
  { id: "zoom", course: "basic", title: "拡大・縮小編", available: true },
  { id: "tap", course: "basic", title: "タップ編", available: false },
  { id: "swipe", course: "basic", title: "スワイプ編", available: false },
  { id: "practice-zoom", course: "practice", title: "拡大・縮小編", available: true },
  { id: "map", course: "practice", title: "地図編", available: false },
  { id: "photo", course: "practice", title: "写真編", available: false },
];

export const levels: Level[] = [
  { id: "zoom-1", categoryId: "zoom", level: 1, description: "画像を拡大・縮小してみよう" },
  { id: "zoom-2", categoryId: "zoom", level: 2, description: "指定された大きさまで拡大・縮小しよう" },
  { id: "zoom-3", categoryId: "zoom", level: 3, description: "小さな文字を拡大して読んでみよう" },
  { id: "zoom-4", categoryId: "zoom", level: 4, description: "拡大して間違いを探そう" },
  { id: "zoom-5", categoryId: "zoom", level: 5, description: "写真の中から指定されたものを探そう" },
  { id: "practice-zoom-1", categoryId: "practice-zoom", level: 1, description: "地図を拡大・縮小して目的地を探そう" },
];

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
