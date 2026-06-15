# alex-1883-test-45

A React + Vite calculator that builds to static files in `dist/`.

## Local Development

```bash
npm ci
npm run dev
```

The development server listens on `0.0.0.0:8080`.

## Production Build

```bash
npm ci
npm run build
```

The production artifact is the bare `dist/` directory. It contains only static
HTML, CSS, and JavaScript files and does not require a Node.js server at
runtime.

## Static Deployment

Deploy the contents of `dist/` to the document root of any static host:

```bash
npm ci
npm run build
# upload or sync the contents of dist/ to the static web root
```

For a quick local production check:

```bash
npm run preview
```

`npm run preview` serves the built files on `0.0.0.0:8080`.

## Build Configuration

No runtime environment variables are required. If the app is served from a
subdirectory instead of the domain root, copy `.env.example` and set
`VITE_BASE_PATH` before building:

```bash
cp .env.example .env.production
VITE_BASE_PATH=/calculator/ npm run build
```

Use `/` for domain-root hosting. Use a leading and trailing slash, such as
`/calculator/`, for subdirectory hosting.

## Validation

```bash
npm run format:check
npm run lint
npm test -- --run
npm run build
npm run test:e2e
```
