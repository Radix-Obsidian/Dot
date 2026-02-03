---
summary: "CLI reference for `dot cron` (schedule and run background jobs)"
read_when:
  - You want scheduled jobs and wakeups
  - You’re debugging cron execution and logs
title: "cron"
---

# `dot cron`

Manage cron jobs for the Gateway scheduler.

Related:

- Cron jobs: [Cron jobs](/automation/cron-jobs)

Tip: run `dot cron --help` for the full command surface.

## Common edits

Update delivery settings without changing the message:

```bash
dot cron edit <job-id> --deliver --channel telegram --to "123456789"
```

Disable delivery for an isolated job:

```bash
dot cron edit <job-id> --no-deliver
```
