# Plugins vs scripts

Both use the `hc` name, but they serve different purposes:

|                   | Request scripts                     | Plugins                                                |
| ----------------- | ----------------------------------- | ------------------------------------------------------ |
| **Lifetime**      | One-shot per send                   | Long-lived until deactivated                           |
| **Runtime**       | utilityProcess + SES                | Renderer: registry + IPC; main: same runner            |
| **API scope**     | Request, variables, tests, response | UI contributions, themes, storage, fs, HTTP hooks, IPC |
| **Where defined** | Collection or request editor        | Installed `.hcp` package                               |

Request scripts cannot call plugin-only APIs. Plugins do not replace collection or request scripts for per-send logic. For the script `hc` reference (`hc.request`, `hc.variables`, `hc.test`, and related members), see [Request scripts](https://harborclient.com/request-scripts).
