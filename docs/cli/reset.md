---
summary: "CLI reference for `dot reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `dot reset`

Reset local config/state (keeps the CLI installed).

```bash
dot reset
dot reset --dry-run
dot reset --scope config+creds+sessions --yes --non-interactive
```
