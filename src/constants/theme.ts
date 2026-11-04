// アプリ全体の色・文字サイズ。シニア向けなので文字とタップ領域は大きめにする。

export const colors = {
  // メインの青 (ヘッダー・主要ボタン・「つぎは ここ」の枠)
  blue: "#1F5FAF",
  bluePale: "#EAF1FA",
  // 焼きオレンジ (「つぎは ここ」バッジ・クリア！の文字)
  burntOrange: "#C2570C",
  // 画面の背景 (クリーム色) と、カードの枠線
  background: "#F8F5EF",
  border: "#E2DED6",
  // クリア表示の緑
  clearGreen: "#3E7D32",
  // 練習エリア
  practiceArea: "#E6EDE4",
  practiceBorder: "#B7C9B2",
  // パズルのピース
  piece: "#E2B85A",
  piecePale: "#FBF3DF",

  // ホーム画面のヘッダーの赤 (青・焼きオレンジと並べても浮かない落ち着いた赤)
  homeRed: "#B8323A",
  brandRed: "#E8432E",
  green: "#4CB43C",
  greenLight: "#C4F0B4",
  greenPale: "#EEF9E8",
  orange: "#EE7A1A",
  pink: "#FBE3E0",
  pinkPale: "#FFF5F4",
  white: "#FFFFFF",
  text: "#222222",
  textSub: "#666666",
  gray: "#BBBBBB",
  overlay: "#B3B3B3",
};

export const fontSize = {
  small: 16,
  body: 20,
  large: 24,
  title: 28,
  logo: 32,
};

// コースごとのテーマ色。基本操作編は青、実践編は焼きオレンジ
export type Accent = { main: string; pale: string; dark: string };

export const accents = {
  basic: { main: "#1F5FAF", pale: "#EAF1FA", dark: "#174A8A" },
  practice: { main: "#C2570C", pale: "#FBEDE3", dark: "#94420A" },
} satisfies Record<string, Accent>;

// タップできる要素の最低の高さ
export const minTouchSize = 64;
