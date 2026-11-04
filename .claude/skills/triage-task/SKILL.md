---
name: triage-task
description: GitHub Issue と Notion のタスク一覧から取り組むタスクを決めて実装し、PR まで作成する。Issue 番号が指定されればその Issue を、なければ優先度と期日から次に取り組むべき Issue を選ぶ。着手前に不明点を質問し、回答を Issue 本文に反映する。実装中は commit スキル、完了時は pr スキルを使う。「タスクを進めて」「#12 をやって」「次のタスク」などと頼まれたときに使う。
---

# タスク実行

タスクは GitHub Issue (`mikaminasaki/sumatore`) と Notion の「タスク一覧」データベースの両方で管理している。Notion のタスク名の `#番号` が Issue 番号に対応する。

- Notion タスク一覧: https://app.notion.com/p/404fad8b0a508067a681f9eedd1353ef (data source: `collection://404fad8b-0a50-808f-bf31-000bf0c4107d`)
- Figma デザイン: https://www.figma.com/design/fDrLTESrn9Szmu9tsTH0LP (「仮決定」欄が現在のデザイン)

## 1. タスクの決定

### Issue 番号が指定された場合

`gh issue view <番号> --json number,title,body,state,labels,assignees` で取得し、そのまま手順 2 へ。Close 済みや依存未解決の場合はその旨を伝えて続行するか確認する。

### 指定がない場合

1. Notion MCP (`notion-query-data-sources`) でタスク一覧を取得する。
2. Status が `Not started` で、他人が担当 (Person) になっていないものに絞る。
3. 依存関係を考慮する (データ → 共通コンポーネント → 画面遷移 → 各画面 → レッスン中身)。
4. 優先度 (高い順) → 期日 (早い順) → Issue 番号 (小さい順) で並べる。
5. 選んだ Issue と選定理由を 1〜2 行で示し、他の候補も上位 2〜3 件挙げて、着手してよいか確認する。

## 2. 着手準備

0. **着手が決まったら、他の作業より先に** Issue を自分にアサインし (`gh issue edit <番号> --add-assignee @me`)、Notion の該当タスクの Status を `In progress` にする。
1. ベースブランチを決める。依存先が無い、または全て Close 済みなら `main`。Open の依存先がある場合はその実装ブランチをベースにする。
2. **作業開始前に必ずワークツリーを作成する。** ベースブランチを最新化し (`git fetch origin <ベースブランチ>`)、`git worktree add -b feature/<番号>-<短い英語の説明> ../senior-app-<番号> origin/<ベースブランチ>` で作る。
   - 作成後、ワークツリー内で `npm install` を実行する。
   - 以降の作業 (実装・確認・コミット・PR 作成) はすべてワークツリー内で行う。

## 3. 不明点の解消

着手前に Issue 本文、Notion のタスクページ、Figma の該当画面、関連する既存コード、`AGENTS.md` を読み、仕様の曖昧さ・抜けを洗い出す。

不明点があれば AskUserQuestion でまとめて質問する (推奨案を先頭に)。既存コードや慣習から判断できることは質問せず、判断内容を後で報告する。

回答を得たら、実装前に Issue 本文 (`gh issue edit <番号> --body-file <file>`) の対応内容・受け入れ基準に決定事項を追記する。

## 4. 実装

- `AGENTS.md` に従う (Expo のバージョン付きドキュメントを確認、ルートは `src/app/`、それ以外は `src/` 配下)。
- 自動テストの仕組みはまだ無いため、`npx expo lint`・`npx tsc --noEmit` と Expo Go での動作確認で代える。
- 意味のある区切りごとに **`commit` スキル** でコミットする (最後にまとめてコミットしない)。
- 実装中に新たな不明点が出たら、作業を止めて質問し、手順 3 と同様に Issue に反映する。

## 5. 完了

1. Issue の受け入れ基準を全て満たしているか確認する。
2. **`pr` スキル** で PR を作成する。
3. Notion の Status を更新し、PR の URL を報告する。
