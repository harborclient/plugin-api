# @harborclient/plugin-api

TypeScript definitions for [HarborClient](https://harborclient.com/) plugin development.

This package ships `.d.ts` only — install it as a **dev dependency** for type-checking your plugin project. It tracks HarborClient releases.

## Install

```bash
pnpm add -D @harborclient/plugin-api
```

## Usage

Import types in your plugin entry module:

```tsx
import type { PluginContext } from '@harborclient/plugin-api';

export function activate(hc: PluginContext): void {
  // ...
}

export function deactivate(): void {
  // optional cleanup
}
```

Your plugin should mark `react` and `react-dom` as external in your bundler and use `hc.react` at runtime instead of bundling React.

## License

MIT
