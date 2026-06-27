# Main API

Optional `main` entry modules export `activate(hc)` and `deactivate()` like renderer entries, but run inside the SES-hardened utilityProcess. Use this entry for HTTP hooks and custom IPC — not for React UI.

Import `MainPluginContext` from `@harborclient/sdk` (or `@harborclient/sdk/main` for main-only plugins) and type your entry as `activate(hc: MainPluginContext)`.

See [Architecture](/architecture#two-runtimes) for how the main entry fits alongside the renderer entry.

## hc.storage

Same namespaced `get` / `set` API as the renderer. Requires the `storage` permission.

## hc.http.onBeforeSend(handler)

**Signature:** `(handler: (request) => void \| Promise<void>) => Disposable`

Register a callback that runs before each outgoing HTTP request. Mutate the request object to change method, URL, headers, or body. Requires the `http` permission. Remove a header with `delete request.headers['Header-Name']`.

```typescript
import type { MainPluginContext } from '@harborclient/sdk';

export function activate(hc: MainPluginContext): void {
  hc.subscriptions.push(
    hc.http.onBeforeSend(async (request) => {
      request.headers['X-Plugin-Trace'] = '1';
      delete request.headers['Authorization'];
    })
  );
}
```

## hc.http.onAfterSend(handler)

**Signature:** `(handler: (request, response) => void \| Promise<void>) => Disposable`

Register a callback that runs after the response is received. Requires the `http` permission.

For UI-only plugins that react to completed sends (history, recent-requests, response diff), prefer renderer-side `hc.http.onAfterSend` in the renderer entry — it fires in-process with no main entry, custom IPC channel, or polling. Use this main-process hook when you need to run logic in the SES-hardened utilityProcess or mutate shared main-side state.

## hc.ipc.handle(channel, handler)

**Signature:** `(channel: string, handler: (...args) => unknown) => Disposable`

Expose an RPC channel callable from the renderer half of the same plugin. Requires the `ipc` permission.

Main-process hooks are invoked by posting work to the utilityProcess runner; the main process applies mutations and enforces permissions before and after each callback.

See the [Request logger example](/examples/request-logger) for a main-only plugin using HTTP hooks.

## hc.server

**Requires the `server` permission.**

Runs a local HTTP echo server in the Electron main process (express). Port `0` selects the first available non-privileged port from the OS. Register `onRequest` before calling `start` so incoming traffic is routed through your handler.

```typescript
import type { MainPluginContext } from '@harborclient/sdk';

export function activate(hc: MainPluginContext): void {
  hc.subscriptions.push(
    hc.server.onRequest(async (request) => {
      // Return custom JSON, or undefined to use the default httpbin-style echo payload.
      return { ...request.echo, custom: true };
    })
  );

  void hc.server.start({ port: 0 }).then(({ port }) => {
    console.log(`Echo server listening on http://localhost:${port}`);
  });
}
```

### hc.server.start(options?)

**Signature:** `(options?: { port?: number }) => Promise<{ port: number }>`

Starts listening. Returns the assigned port after the server accepts connections.

### hc.server.stop()

**Signature:** `() => Promise<void>`

Stops the echo server owned by this plugin.

### hc.server.onRequest(handler)

**Signature:** `(handler: (request) => unknown | Promise<unknown>) => Disposable`

Invoked for each incoming HTTP request. The `request` object includes a default `echo` payload (args, data, files, form, headers, json, origin, url). Return a JSON-serializable value for the response body. When the handler returns `undefined`, the host sends the default echo payload.

## hc.scripts

**Signature:** `(init?: PluginScriptContextInit) => PluginScriptContext`

Creates a script sandbox that exposes the **same `hc` object** as collection and request pre/post scripts. Use it to run tests, mutate a request snapshot, or read a response with `hc.response.json()` inside your main entry.

No extra permission is required. Contexts start with only the hc API plus globals you inject with `setVariable` and `setFunction`.

```typescript
import type { MainPluginContext } from '@harborclient/sdk';

export function activate(hc: MainPluginContext): void {
  const context = hc.scripts.createContext({
    phase: 'post',
    request: {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: [],
      params: [],
      body: '',
      bodyType: 'none'
    },
    response: {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: '{"ok":true}',
      timeMs: 12,
      sizeBytes: 11
    },
    variables: { token: 'abc' }
  });

  context.setFunction('console', console);

  const result = context.run(`
    const data = hc.response.json();
    hc.test('is ok', () => hc.expect(data.ok).to.equal(true));
    hc.variables.set('lastStatus', String(hc.response.code));
    data.ok;
  `);

  // result.value === true
  // result.tests, result.variableSets, result.logs, result.request, ...
}
```

### PluginScriptContext

| Method                     | Description                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `setVariable(name, value)` | Injects a global variable visible to subsequent `run()` calls.                                                           |
| `setFunction(name, fn)`    | Injects a global function; overrides built-in globals such as `console` when names collide.                              |
| `run(script)`              | Evaluates script synchronously; returns {@link PluginScriptRunResult} with hc mutations and the last-expression `value`. |

`run()` returns the full structured result: mutated `request`, `variableSets`, `collectionVariableSets`, `environmentVariableSets`, `globalVariableSets`, `collectionHeaders`, `tests`, `logs`, optional `error`, and `value` (the script's last expression).

The hc surface matches pre/post request scripts: `hc.request`, `hc.variables`, `hc.collection`, `hc.environment`, `hc.globals`, `hc.test`, `hc.expect`, and `hc.response` (when `init.response` is provided). See [Request scripts](https://harborclient.com/request-scripts) for the full hc reference.

Tests and logs accumulate across multiple `run()` calls on the same context. Request and variable mutations persist until you create a new context.
