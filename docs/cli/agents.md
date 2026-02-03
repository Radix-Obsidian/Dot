---
summary: "CLI reference for `dot agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
title: "agents"
---

# `dot agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
dot agents list
dot agents add work --workspace ~/.dot/workspace-work
dot agents set-identity --workspace ~/.dot/workspace --from-identity
dot agents set-identity --agent main --avatar avatars/dot.png
dot agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.dot/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
dot agents set-identity --workspace ~/.dot/workspace --from-identity
```

Override fields explicitly:

```bash
dot agents set-identity --agent main --name "dot" --emoji "🦞" --avatar avatars/dot.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "dot",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/dot.png",
        },
      },
    ],
  },
}
```
