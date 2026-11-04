// レッスンの定義データ。カテゴリやレベルを増やすときはここに追記する。

export type CourseId = "basic" | "practice";

export type Category = {
  id: string;
  course: CourseId;
  title: string;
  // メニューのカードに出す ひとことの説明
  description: string;
  // レベル一覧の上に出す説明文
  intro: string;
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
  { id: "zoom", course: "basic", title: "拡大・縮小編", description: "写真を 大きく・小さく する", intro: "2本の指で、写真や文字を 大きくしたり 小さくしたり する れんしゅうです。", available: true },
  { id: "tap", course: "basic", title: "タップ編", description: "画面を 指で かるく おす", intro: "画面を かるく おす れんしゅうです。", available: false },
  { id: "swipe", course: "basic", title: "スワイプ編", description: "指で 画面を すべらせる", intro: "指で 画面を すべらせる れんしゅうです。", available: false },
  { id: "practice-zoom", course: "practice", title: "拡大・縮小編", description: "地図を 大きく・小さく する", intro: "地図を 大きくしたり 小さくしたりして、目的地を さがす れんしゅうです。", available: true },
  { id: "map", course: "practice", title: "地図編", description: "地図アプリを つかう", intro: "地図アプリを つかう れんしゅうです。", available: false },
  { id: "photo", course: "practice", title: "写真編", description: "写真アプリを つかう", intro: "写真アプリを つかう れんしゅうです。", available: false },
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

// 同じカテゴリの次のレベル (最後のレベルなら undefined)
export function getNextLevel(levelId: string) {
  const level = getLevel(levelId);
  if (!level) return undefined;
  return levels.find((l) => l.categoryId === level.categoryId && l.level === level.level + 1);
}
