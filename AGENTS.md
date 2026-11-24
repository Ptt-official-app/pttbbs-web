# Repository Guidelines

## Project Overview
`github.com/Ptt-official-app/pttbbs-web`: demo web front-end for PTT BBS (React 19 + TypeScript + Vite). It is a multi-page app that talks over HTTP/JSON to [pttbbs-backend](https://github.com/Ptt-official-app/pttbbs-backend) (which wraps go-pttbbs). UI: react-bootstrap, react-widgets, fixed-data-table-2; i18n: i18next (`en`, `zh-TW`); times are formatted with moment-timezone.

## Architecture & Data Flow
- Several independent HTML entry pages in `htmls/*.html` (all, home, login, register, user-info, change-email, attempt-change-email, init, error). Each loads `src/main/<name>.tsx`, which calls `core(Routes)` from `src/main/core.tsx` with a router from `src/routes/<Name>.tsx`.
- `core.tsx` registers every thunk module with `registerThunk` (use-thunk) and renders `<Routes />` into `#root`. `routes/*.tsx` use `react-router-dom` (`BrowserRouter`) and call `DoHeader.init` on mount.
- State management is `use-thunk`: components call `useThunk<DoX.State, typeof DoX>(DoX)` and dispatch actions from `src/thunks/*.ts`. Each thunk module exports `name` (`pttbbs-web/<Page>`), `State` (extends `State` in `src/types.ts`, which has `errmsg`), `defaultState` and action creators returning `Thunk<State>`.
- Thunks call `src/api/` (`api.ts` builds `fetch` requests: `API_ROOT` from `config`, CSRF token read from the `#__csrftoken__` element's `value`, bearer access token, `credentials: "include"`, results as `{status, data, errmsg}`; status 599 on network errors). Endpoint wrappers are in `src/api/serverUtils.ts`, types in `src/api/types.ts`.
- Runtime configuration (`BRAND`, `API_ROOT`, `CLIENT_ID`, `CLIENT_SECRET`, `TERM_URL`, `LIST_LIMIT`, `PTT_GUEST`, `ZK_URL`) is imported as the module `config`, which is not in the repo tree: it must be copied into `node_modules/config`.

## Key Directories
- `src/api/` HTTP client, endpoint wrappers, API types
- `src/thunks/` page state and data loading (one file per page; `utils.ts` has list merging, board URL, date helpers)
- `src/components/` React components (`*Page.tsx` per page, `cells/` for table cells, `*.module.css` CSS modules); `Editor.tsx`/`Screen.tsx` render the terminal-style article editor/view
- `src/routes/` per-HTML-page router; `src/main/` per-HTML-page entry; `htmls/` HTML templates
- `src/i18n/` translations (`en.ts`, `zh-TW.ts`, `types.ts`); `src/hooks/`; `src/constants.tsx`; `src/types.ts`
- `config.tmpl/` (dev template) and `config.test/` (CI/test values) are the `config` module sources
- `tests/tests_api/` vitest tests; `scripts/deploy.sh` builds and rsyncs `dist/`

## Development Commands
```
npm ci                                # install
cp -R config.tmpl node_modules/config # required once before dev/build/test (CI uses config.test)
npm run dev                           # vite dev server, http://localhost:5173
npm run build                         # rm -rf dist && tsc -b && vite build, then moves dist/htmls/*.html to dist/ and links index.html -> all.html
npm test                              # vitest (watch mode locally; coverage enabled in vitest.config.ts)
npx vitest run --coverage.enabled=false  # one-shot test run
npm run lint                          # biome lint .
npm run fmt                           # biome format --write .
./scripts/deploy.sh <dir>             # build and rsync dist/ to <dir>
```

## Code Conventions & Common Patterns
- Formatting/linting by Biome (`biome.json`): 2-space indent, organized imports, recommended rules for project/types/react/test domains; `noArrayIndexKey` is off. Suppress with `// biome-ignore lint/<rule>: <reason>`. Existing code still has `noExplicitAny` warnings.
- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`): use `import type` for types, no enums.
- Components and routes are default-exported arrow functions; files are PascalCase for components and camelCase for thunks.
- Thunk pattern: copy `src/thunks/header.ts`. Use `set(myID, {...})` to update state, store failures in `errmsg` using constants from `src/thunks/errors.ts`.
- User-visible strings go through i18n (`src/i18n/*`); new keys must be added to both `en.ts` and `zh-TW.ts`.
- Time display uses `Asia/Taipei` and 24-hour format.
- Adding a new standalone page requires: `htmls/<name>.html`, `src/main/<name>.tsx`, `src/routes/<Name>.tsx`, an `input` entry in `vite.config.ts`, and thunk registration in `src/main/core.tsx` if it has a new thunk.

## Important Files
`package.json`, `vite.config.ts`, `vitest.config.ts`, `biome.json`, `tsconfig*.json`, `src/main/core.tsx`, `src/api/api.ts`, `src/api/serverUtils.ts`, `src/thunks/utils.ts`, `src/types.ts`, `src/globals.d.ts` (declares the `config` module), `config.tmpl/index.ts`, `config.test/index.ts`, `.github/workflows/node.js.yml`, `.github/pull_request_template.md`.

## Runtime/Tooling Preferences
- Node.js 24.x (CI), npm with `package-lock.json` (use `npm ci`); ESM (`"type": "module"`).
- Vite 8, TypeScript 7 (`tsc -b` runs inside the build), Biome 2.5.13 (pinned; dependabot ignores it), Vitest 5 with `happy-dom`.
- `config`, `dist`, `coverage` are git-ignored; do not commit them.
- Dependabot opens weekly npm and GitHub Actions update PRs.

## Testing & QA
- Tests live in `tests/**/*.{test,spec}.{js,ts,...}` (vitest `include`), environment `happy-dom`, `restoreMocks: true`. Existing tests: `tests/tests_api/api.test.ts`, which exercises `apiParamsToFetchParams` via the exported `_testing` object.
- Tests import `config`, so `node_modules/config` must exist first (`cp -R config.test node_modules/config`); expected `API_ROOT` is `http://localhost:3457`.
- CI (`.github/workflows/node.js.yml`) runs `npm ci`, copies `config.test`, and `npm run build`; the test step is currently commented out, so run tests locally.
- PRs follow `.github/pull_request_template.md` (Why / How / Related Issues / References).
