---
summary: "CLI reference for `dot config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `dot config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `dot configure`).

## Examples

```bash
dot config get browser.executablePath
dot config set browser.executablePath "/usr/bin/google-chrome"
dot config set agents.defaults.heartbeat.every "2h"
dot config set agents.list[0].tools.exec.node "node-id-or-name"
dot config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
dot config get agents.defaults.workspace
dot config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
dot config get agents.list
dot config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
dot config set agents.defaults.heartbeat.every "0m"
dot config set gateway.port 19001 --json
dot config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
