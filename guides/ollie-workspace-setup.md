---
title: Ollie workspace setup
description: Configure Cursor and Claude Code to share Ollie memories while working on ElderTree
---

# Ollie workspace setup

Use **Ollie** as your AI assistant when developing or operating ElderTree — in **Cursor**, **Claude Code**, or the **Ollie** app on the cluster.

This page is the Eldertree entry point. The **canonical setup guide** (all raolivei projects) lives in workspace-config:

**→ [OLLIE_WORKSPACE_SETUP.md](https://github.com/raolivei/workspace-config/blob/main/docs/OLLIE_WORKSPACE_SETUP.md)**

## Quick setup (Mac)

```bash
cd ~/WORKSPACE/raolivei/workspace-config
./scripts/setup-ollie-workspace.sh
```

Then open **`RAOLIVEI.code-workspace`** (not the `ollie/` folder alone).

## What you get

| Piece | Location |
|-------|----------|
| Shared memories | `ollie/memory/` (Cursor + Claude read the same files) |
| Session handoff | `ollie/memory/HANDOFF.md` — edit when switching tools |
| Cursor rules | `.cursor/rules/ollie-persona.mdc` at workspace root |
| Doc search (RAG) | `cd ollie && make index` |

## ElderTree-specific

### Ask Ollie about the cluster

**Local** (after `make dev-api` in `ollie/`):

```bash
curl -X POST http://127.0.0.1:8765/api/v1/workspace/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I check node-1 watchdog status?"}'
```

**On cluster** (LAN or Tailscale):

- Web UI: `http://ollie.eldertree.local:8501` (if exposed)
- API: `http://ollie.eldertree.local:8000`

Reindex after pi-fleet or runbook changes:

```bash
cd ~/WORKSPACE/raolivei/ollie && make index
```

### Continue a Cursor chat in Claude (or reverse)

1. Update [`ollie/memory/HANDOFF.md`](https://github.com/raolivei/ollie/blob/main/memory/HANDOFF.md) with current task and next steps.
2. Open the other tool from the **same workspace root**.
3. Prompt: *"Read HANDOFF and continue."*

### OpenClaw / Telegram

OpenClaw can call Ollie workspace search when `OLLIE_URL` is configured — see [OPENCLAW-001](/runbook/issues/openclaw/OPENCLAW-001).

## Related

- [Project overview](/project) — repos and dashboards
- [Agent workflow](/runbook/workflow) — runbook resolution for incidents
- [Chassis assembly](/runbook/hardware/chassis) — mechanical CAD
- [pi-fleet ELDERTREE.md](https://github.com/raolivei/pi-fleet/blob/main/docs/ELDERTREE.md) — ops map
