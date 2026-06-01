---
id: OPENCLAW-005
title: Config File EBUSY / PVC and exec-approvals EROFS
category: openclaw
severity: medium
symptoms:
  - EBUSY resource busy or locked openclaw.json
  - EROFS read-only exec-approvals.json
  - missing-meta-before-write config anomaly
  - Stale model on PVC vs ConfigMap
  - allowlist miss for kubectl exec
---

# OPENCLAW-005: Config File EBUSY / PVC and exec-approvals EROFS

## Symptoms

- `failed to persist plugin auto-enable changes: Error: EBUSY ... rename ... openclaw.json`.
- `Config observe anomaly: missing-meta-vs-last-good` / `missing-meta-before-write`.
- Gateway logs show wrong **agent model** (e.g. old `gpt-4o-mini`) while Git ConfigMap has `gpt-oss-120b`.
- `exec-approvals.json` EROFS when OpenClaw tries to mutate allowlist.
- `allowlist miss` for elevated `kubectl` commands.

## Error Messages (Searchable)

- `EBUSY: resource busy or locked`
- `openclaw.json`
- `EROFS: read-only file system`
- `exec-approvals.json`
- `missing-meta-before-write`
- `Config overwrite`
- `allowlist miss`

## Root Cause

1. **`openclaw.json` as ConfigMap subPath** — File is bind-mounted read-only; atomic rename for plugin persistence fails with **EBUSY**.
2. **Stale PVC copy** — Writable config on PVC from experiments overrides GitOps intent.
3. **`exec-approvals.json` on ConfigMap mount** — OpenClaw must **write** this file; direct mount → **EROFS**.

## Resolution (Eldertree standard)

Startup script in `helmrelease.yaml`:

1. Mount ConfigMap at **`/etc/openclaw-config`** (not as subPath on `openclaw.json`).
2. **Copy** `config.json` → `$OPENCLAW_DIR/openclaw.json` on PVC **only when ConfigMap SHA-256 changes** (or file missing). Preserves OpenClaw file metadata across restarts.
3. **Copy** `exec-approvals.json` from `/etc/openclaw-defaults/` to PVC on every start.

Skip `openclaw doctor` when config is seeded from ConfigMap.

## Verification

```bash
kubectl logs -n openclaw deployment/openclaw --tail=30 | grep -E 'Seeded|EBUSY|EROFS'
```

Expect:

- `[openclaw] Seeded openclaw.json from ConfigMap` or `Keeping PVC openclaw.json (ConfigMap hash unchanged)`
- `[openclaw] Seeded exec-approvals.json`
- No EBUSY on startup

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/helmrelease.yaml`
- `pi-fleet/clusters/eldertree/openclaw/exec-approvals-configmap.yaml`
