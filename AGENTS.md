This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Team workflow (read before starting any task)

This project is developed by two people, one using Claude Code and one using Codex (ChatGPT). Both AI tools must follow the same procedures. Respond to the user in Japanese.

The procedures live in `.claude/skills/`. They are plain Markdown, so any AI tool should read and follow them even if it does not load skills automatically:

| When | Follow |
|---|---|
| Starting a task ("#12 をやって", "次のタスク") | `.claude/skills/triage-task/SKILL.md` |
| Committing | `.claude/skills/commit/SKILL.md` |
| Opening a pull request | `.claude/skills/pr/SKILL.md` |

Human-facing rules and setup are in `CONTRIBUTING.md`. The most important ones:

- Never commit or push directly to `main`. One task = one branch (`feature/<issue番号>-<説明>`) = one PR.
- Before starting, assign yourself to the GitHub Issue and set the Notion task to `In progress`, so the two people never work on the same task.
- Start from the latest `main` (`git fetch origin main`), and run `npm install` after pulling.
- Do not change shared files (`src/constants/theme.ts`, `src/components/`, `src/data/lessons.ts`, `package.json`) without telling the other person; mention it in the PR.
- Add libraries only with `npx expo install`. Run `npx tsc --noEmit` and `npx expo lint` before every PR.
- Never commit secrets (`.env*`, keys, tokens).
