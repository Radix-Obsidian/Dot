---
summary: "Install dot (recommended installer, global install, or from source)"
read_when:
  - Installing dot
  - You want to install from GitHub
title: "Install"
---

# Install

Use the installer unless you have a reason not to. It sets up the CLI and runs onboarding.

## Quick install (recommended)

```bash
curl -fsSL https://dot.ai/install.sh | bash
```

Windows (PowerShell):

```powershell
iwr -useb https://dot.ai/install.ps1 | iex
```

Next step (if you skipped onboarding):

```bash
dot onboard --install-daemon
```

## System requirements

- **Node >=22**
- macOS, Linux, or Windows via WSL2
- `pnpm` only if you build from source

## Choose your install path

### 1) Installer script (recommended)

Installs `dot` globally via npm and runs onboarding.

```bash
curl -fsSL https://dot.ai/install.sh | bash
```

Installer flags:

```bash
curl -fsSL https://dot.ai/install.sh | bash -s -- --help
```

Details: [Installer internals](/install/installer).

Non-interactive (skip onboarding):

```bash
curl -fsSL https://dot.ai/install.sh | bash -s -- --no-onboard
```

### 2) Global install (manual)

If you already have Node:

```bash
npm install -g dot@latest
```

If you have libvips installed globally (common on macOS via Homebrew) and `sharp` fails to install, force prebuilt binaries:

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g dot@latest
```

If you see `sharp: Please add node-gyp to your dependencies`, either install build tooling (macOS: Xcode CLT + `npm install -g node-gyp`) or use the `SHARP_IGNORE_GLOBAL_LIBVIPS=1` workaround above to skip the native build.

Or with pnpm:

```bash
pnpm add -g dot@latest
pnpm approve-builds -g                # approve dot, node-llama-cpp, sharp, etc.
pnpm add -g dot@latest           # re-run to execute postinstall scripts
```

pnpm requires explicit approval for packages with build scripts. After the first install shows the "Ignored build scripts" warning, run `pnpm approve-builds -g` and select the listed packages, then re-run the install so postinstall scripts execute.

Then:

```bash
dot onboard --install-daemon
```

### 3) From source (contributors/dev)

```bash
git clone https://github.com/dot/dot.git
cd dot
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
dot onboard --install-daemon
```

Tip: if you don’t have a global install yet, run repo commands via `pnpm dot ...`.

### 4) Other install options

- Docker: [Docker](/install/docker)
- Nix: [Nix](/install/nix)
- Ansible: [Ansible](/install/ansible)
- Bun (CLI only): [Bun](/install/bun)

## After install

- Run onboarding: `dot onboard --install-daemon`
- Quick check: `dot doctor`
- Check gateway health: `dot status` + `dot health`
- Open the dashboard: `dot dashboard`

## Install method: npm vs git (installer)

The installer supports two methods:

- `npm` (default): `npm install -g dot@latest`
- `git`: clone/build from GitHub and run from a source checkout

### CLI flags

```bash
# Explicit npm
curl -fsSL https://dot.ai/install.sh | bash -s -- --install-method npm

# Install from GitHub (source checkout)
curl -fsSL https://dot.ai/install.sh | bash -s -- --install-method git
```

Common flags:

- `--install-method npm|git`
- `--git-dir <path>` (default: `~/dot`)
- `--no-git-update` (skip `git pull` when using an existing checkout)
- `--no-prompt` (disable prompts; required in CI/automation)
- `--dry-run` (print what would happen; make no changes)
- `--no-onboard` (skip onboarding)

### Environment variables

Equivalent env vars (useful for automation):

- `dot_INSTALL_METHOD=git|npm`
- `dot_GIT_DIR=...`
- `dot_GIT_UPDATE=0|1`
- `dot_NO_PROMPT=1`
- `dot_DRY_RUN=1`
- `dot_NO_ONBOARD=1`
- `SHARP_IGNORE_GLOBAL_LIBVIPS=0|1` (default: `1`; avoids `sharp` building against system libvips)

## Troubleshooting: `dot` not found (PATH)

Quick diagnosis:

```bash
node -v
npm -v
npm prefix -g
echo "$PATH"
```

If `$(npm prefix -g)/bin` (macOS/Linux) or `$(npm prefix -g)` (Windows) is **not** present inside `echo "$PATH"`, your shell can’t find global npm binaries (including `dot`).

Fix: add it to your shell startup file (zsh: `~/.zshrc`, bash: `~/.bashrc`):

```bash
# macOS / Linux
export PATH="$(npm prefix -g)/bin:$PATH"
```

On Windows, add the output of `npm prefix -g` to your PATH.

Then open a new terminal (or `rehash` in zsh / `hash -r` in bash).

## Update / uninstall

- Updates: [Updating](/install/updating)
- Migrate to a new machine: [Migrating](/install/migrating)
- Uninstall: [Uninstall](/install/uninstall)
