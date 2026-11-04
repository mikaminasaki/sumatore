# ゲームの作り方

練習画面（`src/app/lesson/[levelId].tsx`）は「入れ物」です。ステップのバー、キャラクターの吹き出し、「ヒントを 見る」ボタンは、どのレベルでも練習画面が表示します。
ゲームの中身（練習エリアに出すもの）だけを、レベルごとに別のファイルで作ります。

見本: `src/games/zoom/level1.tsx`（拡大・縮小編 レベル 1）

## 手順

### 1. ファイルを作る

`src/games/<カテゴリ id>/level<番号>.tsx` を作ります。カテゴリ id は `src/data/lessons.ts` にあります。

例: 写真編 レベル 1 → `src/games/photo/level1.tsx`

### 2. ゲームを書く

```tsx
import type { Game, GameProps } from "@/games/types";

function PhotoLevel1({ step, onStepComplete }: GameProps) {
  // step: 今のステップ（0, 1, 2 …）
  // onStepComplete(): そのステップができたら呼ぶ
  return <View>{/* 練習エリアに出すもの */}</View>;
}

export const photo1: Game = {
  steps: [
    { instruction: "吹き出しに出す文", hint: "ヒントを 見る で出す文" },
    { instruction: "…", hint: "…" },
  ],
  Component: PhotoLevel1,
};
```

- `steps` の数が、画面上の「ステップ 1 / 3」の数になります。
- 最後のステップで `onStepComplete()` を呼ぶと、自動でクリアが記録され、クリア画面に進みます。
- ステップが 1 つだけのゲームなら、`steps` に 1 つだけ書きます。

### 3. 対応表に登録する

`src/games/registry.ts` に 1 行足します。

```ts
import { photo1 } from "@/games/photo/level1";

const games: Record<string, Game> = {
  "zoom-1": zoom1,
  "photo-1": photo1, // ← 追加
};
```

キーはレベルの id（`lessons.ts` の `カテゴリ id-番号`）です。登録していないレベルは、練習画面に「（仮）クリアする」ボタンが出ます。

### 4. 確認する

```bash
npx tsc --noEmit
npx expo lint
npx expo start -c
```

Expo Go で該当レベルを開き、最後までやるとクリア画面に進むことを確かめます。

## 決まりごと

- 1 レベル = 1 ファイル。ほかの人のゲームのファイルは触らない（コンフリクトを防ぐため）。
- 2 人とも触るのは `registry.ts` の 1 行だけ。もしコンフリクトしたら、両方の行を残せば解決します。
- 文はシニア向けに、短く・ひらがな多めで。指の動かし方は「2本の指」「ゆっくり」など具体的に書く。
- 色は `src/constants/theme.ts` の `colors` を使う。直接 `#123456` と書かない。
- 写真やイラストは #7 で用意したものを `assets/` に入れて使う。
- ピンチ・スワイプ・長押しなどは `react-native-gesture-handler`（v3 の `usePinchGesture` など）を使う。見本の `zoom/level1.tsx` を参考にする。
- 新しいライブラリが必要なときは、`npx expo install <名前>` で入れ、相方に伝える。

## AI に頼むとき（Claude Code / Codex）

> `src/games/README.md` と見本の `src/games/zoom/level1.tsx` を読んで、写真編のレベル 1「カメラで 写真を とろう」を作って。registry.ts への登録もして。
