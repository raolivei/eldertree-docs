---
id: OPENCLAW-009
title: OpenClaw OOM and Node Memory
category: openclaw
severity: high
symptoms:
  - Pod OOMKilled or CrashLoopBackOff
  - FATAL ERROR Reached heap limit
  - OpenClaw restart after heavy agent sessions
---

# OPENCLAW-009: OpenClaw OOM and Node Memory

## Symptoms

- OpenClaw pod **OOMKilled** or restart loop.
- Logs: `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`.
- Node under memory pressure on Raspberry Pi cluster.

## Error Messages (Searchable)

- `Reached heap limit`
- `JavaScript heap out of memory`
- `OOMKilled`
- `Exit code 137`

## Resolution

Current Eldertree limits in `helmrelease.yaml`:

- **`NODE_OPTIONS`**: `--max-old-space-size=2048`
- **Pod memory**: request `1536Mi`, limit **`3Gi`**
- Do not set Node heap close to pod limit (leave headroom for native memory).

If OOM persists:

1. Reduce concurrent sessions / restart pod after heavy use.
2. Lower `contextTokens` or avoid huge tool outputs ([OPENCLAW-003](/runbook/issues/openclaw/OPENCLAW-003)).
3. Check node memory: `kubectl top pods -n openclaw`.

## Verification

```bash
kubectl get pod -n openclaw -l component=openclaw -o jsonpath='{.items[0].status.containerStatuses[0].lastState}'
kubectl describe pod -n openclaw -l component=openclaw | grep -A5 Limits
```

Pod stays **Running** under normal Telegram load.

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/helmrelease.yaml`
