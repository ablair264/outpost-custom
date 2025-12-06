# Repository Guidelines

Outpost Custom mixes a Create React App frontend with lightweight Node/Supabase utilities. Follow these notes whenever you extend the repo.

## Project Structure & Module Organization

- `src/` holds the client: `pages/` for routed views, `components/` for shared UI, `contexts/` for providers like `CartContext`, `hooks/` and `utils/` for logic, and `styles/` for Tailwind helpers. Story-specific data sits under `src/data/`.
- Browser assets live in `public/` and `Website Assets/`; generated builds land in `build/`.
- Automation lives in `scripts/` (e.g., `generate-product-summary.js`) and `backend/` for Supabase/OpenAI indexing. Keep new agents or cron jobs beside similar files.

## Build, Test, and Development Commands

- `npm run dev` — runs the Express helper (`backend-example.js`) and CRA dev server together for full-stack manual testing.
- `npm start` — launches only the frontend on `localhost:3000`.
- `npm run backend` — executes the standalone backend script; useful when debugging chat indexing.
- `npm run build` — produces the production bundle in `build/`.
- `npm test` — runs Jest in watch mode with React Testing Library matchers; use `CI=true npm test` for a single pass in CI.

## Coding Style & Naming Conventions

- Use TypeScript everywhere in `src/`; prefer functional components and React hooks. Components/pages are PascalCase (`ShopFrontPage.tsx`), hooks/utilities are camelCase (`useScrollLock.ts`), and routes live under `src/pages`.
- Keep indentation at two spaces, stick with Tailwind utility classes plus the global styles in `src/styles` instead of ad-hoc inline CSS.
- When adding contexts or providers, wire them through `App.tsx` so routing stays centralized.

## Testing Guidelines

- Jest + React Testing Library are preconfigured via `src/setupTests.ts`. Place specs next to the modules they cover (e.g., `components/Card.test.tsx`).
- Mock network calls with `jest.spyOn` or MSW; keep assertions user-focused.
- New UI or data modules need accompanying tests that hit the unique code paths you add; snapshot tests alone are insufficient.

## Commit & Pull Request Guidelines

- Write imperative, scoped subjects (`feat: add ShopFrontPage carousel`) and keep body lines under 72 chars. Reference issues with `Closes #123` when applicable.
- PRs must describe user impact, list manual test commands, and attach screenshots for visual work.

## Security & Configuration Tips

- Secrets load via `.env` and `update-env-key.md`; never commit real keys. Use the stub `.env.example` format when adding vars.
- When touching Supabase/OpenAI scripts in `backend/`, audit `SECURITY-SETUP.md` to keep data handling aligned with the documented retention rules.
