# @harborclient/plugin-api

TypeScript definitions, utility modules, and React runtime helpers for [HarborClient](https://harborclient.com/) plugin development.

**Documentation:** [https://harborclient.github.io/plugin-api/](https://harborclient.github.io/plugin-api/)

Install as a **dev dependency** in your plugin project. The package ships type declarations, HTTP/storage/UI helpers, and a JSX runtime that forwards to the host's React instance via `installReact(hc.react)`.

Requires HarborClient **>=1.9.0** when using `hc.pluginId`, renderer HTTP lifecycle events, typed IPC invoke, and host request commands.

## Install

```bash
pnpm add -D @harborclient/plugin-api
```

See the [install guide](https://harborclient.github.io/plugin-api/install) for version requirements.

## Quick start

```tsx
import { installReact } from '@harborclient/plugin-api';
import type { PluginContext } from '@harborclient/plugin-api';

export function activate(hc: PluginContext): void {
  installReact(hc.react);
  // register contributions…
}
```

Full guides — package layout, manifest, APIs, examples, and dev workflow — live in the [plugin development docs](https://harborclient.github.io/plugin-api/).

## License

MIT
