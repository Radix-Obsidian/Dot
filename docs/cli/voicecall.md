---
summary: "CLI reference for `dot voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `dot voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
dot voicecall status --call-id <id>
dot voicecall call --to "+15555550123" --message "Hello" --mode notify
dot voicecall continue --call-id <id> --message "Any questions?"
dot voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
dot voicecall expose --mode serve
dot voicecall expose --mode funnel
dot voicecall unexpose
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
