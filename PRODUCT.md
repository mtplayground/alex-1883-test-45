# alex-1883-test-45 Product Contract

## Snapshot

`alex-1883-test-45` is a static React + Vite calculator application. It runs
entirely in the browser, builds to a bare `dist/` directory, and requires no
runtime backend or database.

## Current Capabilities

- Basic calculator mode with digit entry, decimal input, clear, delete,
  addition, subtraction, multiplication, division, modulo, and evaluation.
- Scientific mode toggle that exposes trigonometric functions, logarithms,
  powers, square roots, nth roots, parentheses, and function argument
  separators.
- Expression evaluator with tokenization, precedence, parentheses, unary signs,
  right-associative powers, scientific functions, domain checks, divide-by-zero
  checks, and non-finite result protection.
- Physical keyboard support for digits, decimal point, operators, Enter/`=`,
  and Backspace.
- Display handling for invalid expressions, overflow, compact scientific
  notation for extreme values, and long-result truncation.

## Architecture

- `src/engine/` contains the calculation engine: tokenizer, parser/evaluator,
  scientific function handling, shared types, and unit tests.
- `src/features/calculator/` contains calculator state management, keyboard
  wiring, mode toggle, and keypad composition.
- `src/components/` contains reusable display and button primitives.
- Styling is Tailwind CSS via `src/styles.css` and `tailwind.config.js`.
- The app is a single-page static frontend with no authentication, API, storage,
  or server-side runtime.

## Project Conventions

- Development and preview servers listen on `0.0.0.0:8080`.
- Production output is `dist/`; deploy the directory contents to any static web
  root.
- Optional `VITE_BASE_PATH` configures Vite's public base path for subdirectory
  hosting. See `.env.example`.
- Validation commands:
  - `npm run format:check`
  - `npm run lint`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:e2e`

## Test Coverage

- Vitest covers evaluator arithmetic, precedence, parentheses, scientific
  functions, roots, malformed input, domain errors, and overflow.
- Playwright covers core user flows: basic calculation, scientific calculation,
  mode switching, keyboard entry, graceful error display, overflow display, and
  compact long-result formatting.
