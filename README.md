# Digits & Dragons

Digits & Dragons is an educational, turn-based math RPG built with Next.js. Players solve arithmetic problems to attack enemies, level up characters, and progress through encounters. The app is intended for classroom or at-home practice that makes basic math more engaging.

Key ideas:
- Blend simple arithmetic problems (addition, subtraction, multiplication) with classic RPG mechanics.
- Small, single-player battles that are quick to play and easy to extend.

This repository contains the Next.js app, tests (Jest + Testing Library), and mocks for running tests offline.

## Quick start (local development)

Requirements:
- Node.js 18+ (recommended)
- npm (comes with Node) — you can also use yarn, pnpm or bun if you prefer

Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Available scripts (from `package.json`):

- `npm run dev` — start Next.js in development mode
- `npm run build` — build the production app
- `npm start` — start the production server after building
- `npm run lint` — run ESLint
- `npm test` — run Jest (note: script runs in watch mode by default)

To run Jest once (no watch), use npx:

```powershell
npx jest --runInBand
```

## Project structure (high level)

- `app/` — Next.js App Router pages and layout files. Primary entry: `app/page.js` and `app/layout.js`.
- `components/` — UI components and layout helpers.
- `game/` — game screens and styles for the in-app game view.
- `players/`, `subject/` — feature folders for different app sections.
- `data/` — static game data (classes, enemies) and math problem generators under `data/math/`.
- `utils/` — utility modules such as `combat.js`.
- `__tests__/` — Jest tests.
- `mocks/` — MSW and test mocks used by the test suite.

If you want to make a change to the main landing page, edit `app/page.js`. The game logic is primarily in `game/` and `utils/combat.js`.

## Testing

This project uses Jest with Testing Library and MSW for mocked network responses. Run tests with:

```powershell
npm test
```

To run a single test file:

```powershell
npx jest __tests__/App.test.js --runInBand
```

Test-related helpers and mocks live in `mocks/` and `__mocks__/`.

## Linting and formatting

Run ESLint with:

```powershell
npm run lint
```

The repo includes `eslint-config-next` and standard Next.js lint rules.

## Deployment

Digits & Dragons is a Next.js app and can be deployed to Vercel with zero-config. Alternatively, build and serve yourself:

```powershell
npm run build
npm start
```

## Contributing

If you'd like to contribute:

1. Fork the repository and create a feature branch.
2. Add/adjust tests for new behavior.
3. Open a pull request with a clear description of changes.

Small ideas for contributors:
- Add new math subjects (fractions, division, exponents)
- Create new enemy types and abilities in `data/enemies.js` and `data/classes.js`
- Add persistent player progression or a simple backend to save scores

## Notes & assumptions

- This README was updated to reflect the repo layout and scripts present in `package.json`.
- The project currently does not include a `LICENSE` file; add one if you want to change the project's license.

## Acknowledgements

- Built with Next.js. Tests use Jest, Testing Library, and MSW.

Happy hacking — enjoy teaching math through play!
