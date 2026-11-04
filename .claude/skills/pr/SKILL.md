---
name: pr
description: Base branch との差分全体を確認し、PR テンプレートに沿って日本語のタイトル・本文で GitHub Pull Request を作成する。UI 変更時は iOS シミュレーターで Before/After のスクリーンショットを撮って添付し、b1024018-sys にレビューを依頼する。「PR を作って」と頼まれたとき、またはタスク完了時に使う。
---

# PR 作成

## 1. 事前確認

1. 未コミットの差分があれば、先に `commit` スキルでコミットする。
2. Base branch を決める (指定がなければ `main`)。`git fetch origin <base>` で最新化する。
   - 関連 Issue が Open の Issue に依存し、現在ブランチがその依存先の実装ブランチから切られている場合は、依存先ブランチを base とする (Stacked PR)。
3. 現在ブランチが base と同じなら、作業内容を表すブランチ (例: `feature/2-navigation`) を切ってから進める。
4. `npx expo lint` と `npx tsc --noEmit` が通ることを確認する。

## 2. 差分の把握

コミットメッセージだけに頼らず、差分全体を根拠にする。

- `git log --oneline origin/<base>..HEAD`
- `git diff --stat origin/<base>...HEAD`
- `git diff origin/<base>...HEAD`
- ブランチ名・コミット・会話から関連 Issue を特定し、`gh issue view <番号>` で受け入れ基準を確認する。受け入れ基準を全て満たすなら Close 対象とする。

## 3. UI 差分のスクリーンショット (UI を変更した場合のみ)

`src/app/`・`src/components/` 配下や `assets/` に変更がある場合に行う。

1. iOS シミュレーター操作用の MCP を使い、`npx expo start --ios` でアプリを起動する (Expo Go)。
2. **Before**: `git worktree add $TMPDIR/sumatore-base origin/<base>` で base の作業ツリーを作り、そこで起動して該当画面まで遷移し、スクリーンショットを撮る。終わったら `git worktree remove` で片付ける。新規画面で Before が存在しない場合は「なし」とする。
3. **After**: 現在ブランチで同じ画面・同じ状態で撮る。
4. 画像は PR 本文にドラッグ&ドロップできないため、画像用の orphan ブランチ `pr-assets` に `pr/<ブランチ名>/<画面名>-after.png` として置いて push し、`https://raw.githubusercontent.com/mikaminasaki/sumatore/pr-assets/pr/<ブランチ名>/<画面名>-after.png` で参照する。作業ブランチに画像をコミットしない。

## 4. PR の作成

- **タイトル**: 変更内容が簡潔に分かる日本語 (prefix なし)。
- **本文**: `.github/pull_request_template.md` があれば全セクションを日本語で埋める。無ければ以下のセクションで書く。該当なしは「なし」と書き、削除しない。
  - 変更内容: 箇条書き。
  - 関連Issue: `#123` 形式。マージで Close できるものは `Close #123`。
  - 関連リンク: Notion のタスク、Figma のデザイン、参考資料。
  - 動作確認: Expo Go で確認した手順。
  - UI差分: 手順 3 の画像を「画面名 | Before | After」の表で (`<img src="..." width="300">`)。
  - 末尾にシステムから指示された attribution があれば付ける。
- 作成:

```sh
git push -u origin HEAD
gh pr create --base <base> --title "<タイトル>" --body-file <本文ファイル> \
  --assignee @me \
  --reviewer b1024018-sys
```

- PR 作成者自身はレビュアーに指定できないため、作成者が b1024018-sys の場合は mikaminasaki にする。
- 作成後、PR の URL を報告し、Notion のタスク一覧の該当タスクの Status を更新する。
