---
summary: "CLI reference for `dot plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
title: "plugins"
---

# `dot plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:

- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
dot plugins list
dot plugins info <id>
dot plugins enable <id>
dot plugins disable <id>
dot plugins doctor
dot plugins update <id>
dot plugins update --all
```

Bundled plugins ship with dot but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `dot.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
dot plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
dot plugins install -l ./my-plugin
```

### Update

```bash
dot plugins update <id>
dot plugins update --all
dot plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
