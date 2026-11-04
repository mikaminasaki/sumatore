# 開発の進め方（2人用）

このアプリは2人で、それぞれ AI を使って開発します。

- Nasaki：Claude Code
- 相方：Codex（ChatGPT のプランで使える OpenAI の開発ツール）

どちらの AI も、リポジトリの `AGENTS.md` と `.claude/skills/` の手順書を読んで同じルールで動きます。人間は **「タスクを頼む → 動作を確認する → PR をレビューする」** に集中すれば OK です。

---

## 1. 最初の準備（1回だけ）

1. **必要なものを入れる**
   - [Node.js](https://nodejs.org/)（LTS 版）
   - [GitHub CLI](https://cli.github.com/)（`gh`）→ ターミナルで `gh auth login` してログイン
   - スマホに **Expo Go**（App Store / Google Play）。最新版にしておく
2. **リポジトリを手元にコピーする**
   ```bash
   git clone https://github.com/mikaminasaki/sumatore.git
   cd sumatore
   npm install
   ```
3. **Codex を使えるようにする**
   - Codex をインストールし、ChatGPT アカウントでログインする（手順は OpenAI の Codex の案内に従う）
   - `sumatore` フォルダを開いた状態で Codex を起動する。`AGENTS.md` は自動で読まれる
4. **アプリが動くか確認する**（下の「4. 実機で確認する」）

> ChatGPT のチャット画面にコードを貼って作業するのはおすすめしません。AI からプロジェクト全体が見えないため、古いファイルで上書きするなどの事故が起きやすいです。

---

## 2. タスクの進め方（毎回これ）

タスクは **GitHub Issue** と **Notion のタスク一覧** で管理しています。Notion のタスク名の `#番号` が Issue 番号です。

- Notion タスク一覧: https://app.notion.com/p/404fad8b0a508067a681f9eedd1353ef
- Figma（「仮決定」欄が今のデザイン）: https://www.figma.com/design/fDrLTESrn9Szmu9tsTH0LP

### 手順

1. **やるタスクを決めて、相手に伝える**
   - Issue に自分をアサインし、Notion を「In progress」にする（AI に頼めばやってくれます）
   - 相手が「In progress」にしているタスクには触らない
2. **AI に頼む**。例:
   > `#7 をやって。.claude/skills/triage-task/SKILL.md の手順に従って。デザインは Figma のこの画面: （リンク）`
3. **AI の質問に答える**。分からないことは「おすすめで」と答えて OK
4. **実機で確認する**（下の「4」）。違うところは AI にそのまま伝えて直してもらう
5. **AI に PR を作ってもらう**。
   > `PR を作って`
6. **相手にレビューしてもらう** → OK が出たら、PR ページの「Merge pull request」でマージ
7. **Notion を Done にする**。もう1人は `main` を最新にする（下の「3」）

---

## 3. 2人のルール（失敗しないために）

| ルール | 理由 |
|---|---|
| タスクは1人1つ。着手前にアサインする | 同じ作業をしてしまうのを防ぐ |
| `main` に直接 push しない。タスクごとにブランチ → PR | 壊れたコードが `main` に入るのを防ぐ |
| PR は必ず相手がレビューしてからマージ | もう1人が内容を把握できる |
| 始める前に `main` を最新にする | 古いコードの上に作業して衝突するのを防ぐ |
| 共通ファイルを変えるときは一声かける | 同じファイルを同時に触ると衝突する |
| ライブラリは `npx expo install ○○` で追加 | `npm install ○○` だと SDK とバージョンがずれて壊れる |
| `.env` や API キーはコミットしない | 秘密情報の流出を防ぐ |

**共通ファイル**：`src/constants/theme.ts`（色・文字サイズ）、`src/components/`（共通部品）、`src/data/lessons.ts`（レベル一覧）、`package.json`

### main を最新にする方法

```bash
git switch main
git pull
npm install
```

---

## 4. 実機で確認する（Expo Go）

1. パソコンとスマホを**同じ Wi-Fi** につなぐ
2. プロジェクトのフォルダで起動する
   ```bash
   npx expo start
   ```
3. 表示された QR コードを読み取る
   - iPhone：標準のカメラで読み取る
   - Android：Expo Go の「Scan QR code」

| 困ったとき | 対処 |
|---|---|
| つながらない | `npx expo start --tunnel` で起動する |
| 「SDK が合わない」と出る | Expo Go をアップデートする（このアプリは Expo SDK 58） |
| 画面が古いまま | ターミナルで `r` を押して再読み込み |

AI がブランチごとに別フォルダ（ワークツリー）で作業した場合は、そのフォルダに移動してから `npx expo start` します。場所は AI に「どのフォルダで動かせばいい？」と聞けば教えてくれます。

---

## 5. フォルダ構成

```
src/
  app/          画面（ファイル1つ = 画面1つ。Expo Router）
  components/   共通部品（ヘッダー、ボタン、タブなど）
  constants/    色・文字サイズ
  data/         レベルの定義
  hooks/        クリア記録の保存など
.claude/skills/ AI 用の手順書（タスク・コミット・PR）
AGENTS.md       AI 向けのルール
```
