---
summary: "CLI reference for `dot onboard` (interactive onboarding wizard)"
read_when:
  - You want guided setup for gateway, workspace, auth, channels, and skills
title: "onboard"
---

# `dot onboard`

Interactive onboarding wizard (local or remote Gateway setup).

Related:

- Wizard guide: [Onboarding](/start/onboarding)

## Examples

```bash
dot onboard
dot onboard --flow quickstart
dot onboard --flow manual
dot onboard --mode remote --remote-url ws://gateway-host:18789
```

Flow notes:

- `quickstart`: minimal prompts, auto-generates a gateway token.
- `manual`: full prompts for port/bind/auth (alias of `advanced`).
- Fastest first chat: `dot dashboard` (Control UI, no channel setup).
