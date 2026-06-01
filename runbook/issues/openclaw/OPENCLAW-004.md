---
id: OPENCLAW-004
title: Telegram Bot Not Replying (409 / Network)
category: openclaw
severity: high
symptoms:
  - Elder bot silent on Telegram
  - 409 Conflict getUpdates
  - fetch fallback IPv4-only ETIMEDOUT ENETUNREACH
  - Only one bot instance should be running
---

# OPENCLAW-004: Telegram Bot Not Replying (409 / Network)

## Symptoms

- `@eldertree_assistant_bot` does not respond; pod is **Running**.
- Logs: `[telegram] fetch fallback: enabling sticky IPv4-only dispatcher (codes=ETIMEDOUT,ENETUNREACH)` or `UND_ERR_SOCKET`.
- **`409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running`**.

## Error Messages (Searchable)

- `409: Conflict`
- `terminated by other getUpdates request`
- `fetch fallback: enabling sticky IPv4-only dispatcher`
- `ETIMEDOUT`
- `ENETUNREACH`
- `UND_ERR_SOCKET`
- `getUpdates conflict`

## Diagnosis

### A. Duplicate long-poll (409)

Telegram allows **one** `getUpdates` client per bot token. Another process holds the poll:

- Second OpenClaw pod or old replica (rare with `Recreate` strategy).
- **Local OpenClaw** / dev container using the same Vault token.
- Another cluster or laptop session.

```bash
# From OpenClaw pod — should succeed when no duplicate
kubectl exec -n openclaw deploy/openclaw -- sh -c \
  'wget -qO- "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"'
# url must be empty; pending_update_count is informational
```

### B. Egress / DNS (ETIMEDOUT)

Cluster egress to `api.telegram.org` flaky (IPv6 path, DNS, or uplink). OpenClaw enables IPv4-only fallback automatically; persistent failures need network investigation ([NET-001](/runbook/issues/network/NET-001)).

## Resolution

### 409 — stop duplicate poller

1. Find and stop any **local** OpenClaw/gateway using the same bot token.
2. Restart cluster bot only: `kubectl rollout restart deployment/openclaw -n openclaw`.
3. If unresolved, **rotate token** in @BotFather → update Vault `secret/openclaw/telegram` → restart OpenClaw.

### Network

1. From pod: `wget -qO- --timeout=20 https://api.telegram.org` and `getMe` with token.
2. Check node egress / Pi-hole / firewall if timeouts persist.

## Verification

```bash
kubectl logs -n openclaw deployment/openclaw --since=10m | grep -i telegram
```

Expect `[telegram] [default] starting provider` without repeating 409 errors. Send a test DM.

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/externalsecret.yaml` (`TELEGRAM_BOT_TOKEN`)
