---
summary: "CLI reference for `dot devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
title: "devices"
---

# `dot devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `dot devices list`

List pending pairing requests and paired devices.

```
dot devices list
dot devices list --json
```

### `dot devices approve <requestId>`

Approve a pending device pairing request.

```
dot devices approve <requestId>
```

### `dot devices reject <requestId>`

Reject a pending device pairing request.

```
dot devices reject <requestId>
```

### `dot devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
dot devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `dot devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
dot devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
