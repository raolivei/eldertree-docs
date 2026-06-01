---
id: OPENCLAW-002
title: Gateway Auth — Token vs Trusted-Proxy (WebSocket 1008)
category: openclaw
severity: high
symptoms:
  - WebSocket closed with code 1008 unauthorized
  - trusted_proxy_untrusted_source in logs
  - sessions_list failed; internal tools cannot reach gateway
  - Web UI works but Telegram tools fail
---

# OPENCLAW-002: Gateway Auth — Token vs Trusted-Proxy (WebSocket 1008)

## Symptoms

- Logs show `[ws] unauthorized` with `reason=trusted_proxy_untrusted_source`.
- `[tools] sessions_list failed: gateway closed (1008): unauthorized`.
- In-pod clients connect to `ws://127.0.0.1:18789` without `X-Forwarded-User`.
- Traefik Web UI may work while **internal** gateway clients (Telegram agent, tools) fail.

## Error Messages (Searchable)

- `trusted_proxy_untrusted_source`
- `gateway closed (1008): unauthorized`
- `sessions_list failed`
- `GatewayClientRequestError: unauthorized`
- `ws://127.0.0.1:18789`

## Root Cause

**Trusted-proxy** auth expects the configured identity header (`X-Forwarded-User`) on **every** connection. Loopback clients inside the OpenClaw pod do not send that header, so they are rejected even when `trustedProxies` includes `127.0.0.0/8`. See [openclaw#43300](https://github.com/openclaw/openclaw/issues/43300).

Adding loopback CIDRs to `trustedProxies` does **not** fix missing headers.

## Resolution (current Eldertree standard)

Use **`gateway.auth.mode: "token"`** with `token: "${OPENCLAW_GATEWAY_TOKEN}"` in `openclaw-config-file` ConfigMap. Remove Traefik `add-trusted-proxy-user` middleware from the OpenClaw ingress.

1. **Config** (`pi-fleet/clusters/eldertree/openclaw/configmap.yaml`):

   ```json
   "auth": {
     "mode": "token",
     "token": "${OPENCLAW_GATEWAY_TOKEN}"
   }
   ```

2. **Secret** — Vault `secret/openclaw/gateway` → k8s `openclaw-secrets` key `OPENCLAW_GATEWAY_TOKEN`.

3. **Web UI** — Open https://openclaw.eldertree.local and paste the gateway token once when prompted.

4. **Restart** — `kubectl rollout restart deployment/openclaw -n openclaw`.

## Verification

```bash
export KUBECONFIG=~/.kube/config-eldertree
kubectl logs -n openclaw deployment/openclaw --since=1h | grep -iE 'trusted_proxy|1008|unauthorized' || echo "no auth errors"
```

No `trusted_proxy_untrusted_source` lines after restart. Telegram tools that call the gateway should succeed.

## Related

- [OPENCLAW-001](/runbook/issues/openclaw/OPENCLAW-001) — general gateway/config (legacy trusted-proxy notes)
- `pi-fleet/clusters/eldertree/openclaw/README.md`
