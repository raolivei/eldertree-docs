---
id: OPENCLAW-001
title: OpenClaw Gateway and Config Issues
category: openclaw
severity: high
symptoms:
  - Web UI returns 1008 or gateway token required
  - Gateway fails with invalid config (models.default, providers, gateway.bind)
  - Pod crash loop with EROFS / read-only config file
  - Gateway refuses to start: control UI requires allowedOrigins when binding to non-loopback
---

# OPENCLAW-001: OpenClaw Gateway and Config Issues

## Symptoms

- Web UI at https://openclaw.eldertree.local shows connection error or prompts for gateway token (1008).
- OpenClaw fails to start with config validation errors (e.g. `models.default`, top-level `providers`, or `gateway.bind`).
- Pod restarts repeatedly; logs show `EROFS` or read-only filesystem when writing config (e.g. doctor trying to chmod).
- Gateway logs: binding to non-loopback address but control UI not allowed; startup fails or blocks.

## Error Messages (Searchable)

- `Invalid config: models.default`
- `Invalid config: providers` (top-level)
- `Invalid config: gateway.bind`
- `EROFS: read-only file system` (config or openclaw.json)
- `[openclaw] Skipping doctor (config from ConfigMap)`
- `Gateway is binding to a non-loopback address. Ensure authentication is configured`
- `controlUi` / `allowedOrigins` (when binding to 0.0.0.0 or lan)

## Diagnosis

1. **Token 1008** — Gateway is behind Traefik; UI does not send the gateway token. Check Traefik middleware and `gateway.auth.mode: "trusted-proxy"` with `userHeader: "x-forwarded-user"` and `allowUsers: ["local"]`.
2. **Config schema** — OpenClaw 2026 schema: no top-level `providers` or `models.default`; use `agents.defaults.model.primary` and `gateway.bind: "lan"` (or `"loopback"`). Model IDs: `provider/model` (e.g. `google/gemini-1.5-flash`).
3. **Read-only config** — Config is mounted from a ConfigMap (read-only). The default entrypoint runs doctor and may try to write to the config file. Override the container **command** to skip doctor and run `node /app/dist/index.js gateway --bind lan` directly.
4. **Control UI** — When `gateway.bind` is not loopback, set `gateway.controlUi.allowedOrigins` to the Web UI origins (e.g. `https://openclaw.eldertree.local`, `http://openclaw.eldertree.local`).

## Resolution

> **Current standard (2026-04+):** Use **token auth**, not trusted-proxy. See [OPENCLAW-002](/runbook/issues/openclaw/OPENCLAW-002) for WebSocket 1008 / `trusted_proxy_untrusted_source`. The trusted-proxy steps below are **legacy**.

### 1. Token auth (fix 1008 for internal clients + Web UI)

In OpenClaw config (`openclaw-config-file` ConfigMap):

- Set `gateway.auth.mode` to `"token"`.
- Set `gateway.auth.token` to `"${OPENCLAW_GATEWAY_TOKEN}"`.
- Remove Traefik `add-trusted-proxy-user` middleware from OpenClaw ingress.
- Web UI: paste token from Vault `secret/openclaw/gateway` once.

### 1b. Trusted-proxy auth (legacy — do not use on Eldertree)

In OpenClaw config (`openclaw-config-file` ConfigMap):

- Set `gateway.auth.mode` to `"trusted-proxy"`.
- Configure `gateway.auth.trustedProxy` with `userHeader: "x-forwarded-user"` and `allowUsers: ["local"]`.
- In Traefik IngressMiddleware, add header `X-Forwarded-User: local` for the OpenClaw route.

**Note:** Loopback gateway clients still fail with trusted-proxy; use token auth instead.

- Remove any top-level `providers` or `models.default`.
- Use `agents.defaults.model.primary` and `agents.defaults.model.fallbacks` with `provider/model` ids.
- Set `gateway.bind` to `"lan"` or `"loopback"`.

### 3. Skip doctor when config is read-only

In the OpenClaw HelmRelease (or Deployment), override the container **command** so the process does not run doctor:

```yaml
command:
  - /bin/sh
  - -c
  - |
    set -e
    export OPENCLAW_DIR=/home/node/.openclaw
    export CONFIG_FILE=$OPENCLAW_DIR/openclaw.json
    mkdir -p $OPENCLAW_DIR/agents/main/sessions ...
    echo "[openclaw] Skipping doctor (config from ConfigMap)"
    exec node /app/dist/index.js gateway --bind lan
```

### 4. Control UI allowedOrigins

In config, under `gateway.controlUi`:

```json
"controlUi": {
  "allowedOrigins": [
    "https://openclaw.eldertree.local",
    "http://openclaw.eldertree.local"
  ]
}
```

## Verification

- Web UI loads at https://openclaw.eldertree.local (paste gateway token when prompted).
- Pod is 1/1 Running; no restart loop.
- Logs show gateway listening and no EROFS or config write errors.
- Health: `curl -s https://openclaw.eldertree.local/health` returns 200.

## See Also

- [OPENCLAW-002](/runbook/issues/openclaw/OPENCLAW-002) — token auth vs trusted-proxy
- [OPENCLAW-005](/runbook/issues/openclaw/OPENCLAW-005) — EBUSY / PVC config seeding
- [OPENCLAW-009](/runbook/issues/openclaw/OPENCLAW-009) — OOM / heap

## All models failed (Google / Groq / Ollama)

If logs show **FailoverError** or **All models failed** for `google`, `groq`, or `ollama`:

1. **Google:** "No API key found for provider google" — Ensure `GOOGLE_API_KEY` is in `openclaw-secrets` and the config has `models.providers.google.apiKey: "${GOOGLE_API_KEY}"` so the gateway uses the env var.
2. **Groq:** "Unknown model: groq/llama-3.1-70b-versatile" — Use the current catalog id (e.g. `groq/llama-3.3-70b-versatile`). Ensure `GROQ_API_KEY` is set when using Groq.
3. **Ollama:** "Unknown model: ollama/... Ollama requires authentication" — Set `OLLAMA_API_KEY` (e.g. to `ollama-local`) so the provider is registered; the entrypoint can default it with `export OLLAMA_API_KEY="${OLLAMA_API_KEY:-ollama-local}"`.

## In-container `openclaw update` (not supported)

Logs may show `update available (latest): v2026.x.x`. **`openclaw update` inside the Kubernetes pod is not supported** — the image is read-only GitOps-managed. Upgrade path:

1. GitHub Action builds `ghcr.io/raolivei/openclaw` (ARM64).
2. Flux reconciles `pi-fleet` HelmRelease / image tag.
3. Or Elder `elder_upgrade` with approval (if configured).

Do not grant shell "permissions" for in-pod self-update; fix is a new image rollout.

## Related Files

- **ConfigMap:** `pi-fleet/clusters/eldertree/openclaw/configmap.yaml`, `openclaw-config-file`
- **HelmRelease:** `pi-fleet/clusters/eldertree/openclaw/helmrelease.yaml`
- **Ingress/Middleware:** OpenClaw Traefik middleware adding `X-Forwarded-User: local`
