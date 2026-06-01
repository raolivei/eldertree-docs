---
id: OPENCLAW-007
title: Gmail Read/Write via Elder
category: openclaw
severity: medium
symptoms:
  - read my unread emails fails or context overflow
  - Elder cannot access Gmail
  - 401 from Elder API
  - Gmail refresh token not configured
---

# OPENCLAW-007: Gmail Read/Write via Elder

## Architecture

OpenClaw does **not** call Gmail directly. Flow:

```text
Telegram → OpenClaw (curl + ELDER_API_KEY) → Elder /api/gmail/* → Gmail API (OAuth)
```

## Symptoms

- "Read my unread emails" → context overflow (too many tokens) or no action.
- `401 Missing API key` from Elder.
- `500 Gmail refresh token not configured` / `Failed to refresh Gmail credentials`.
- Connection refused OpenClaw → Elder.

## Error Messages (Searchable)

- `Gmail refresh token not configured`
- `Failed to refresh Gmail credentials`
- `Missing API key. Provide X-API-Key header`
- `Connection refused` to `elder.openclaw.svc.cluster.local`

## Setup Checklist

### 1. Vault — `secret/openclaw/gmail`

Keys: `client-id`, `client-secret`, `refresh-token`, `user-email`.

```bash
cd pi-fleet
./scripts/setup-openclaw-gmail.sh
```

Full guide: `pi-fleet/clusters/eldertree/openclaw/GMAIL_SETUP.md`

Google Cloud: enable **Gmail API**, OAuth desktop client, scopes `gmail.readonly`, `gmail.send`, `gmail.modify` (or `https://mail.google.com/`).

### 2. Kubernetes

- ExternalSecret maps Gmail keys → `openclaw-secrets` → **Elder** env `ELDER_GMAIL_*`.
- OpenClaw needs **`ELDER_API_KEY`** (from `elder-secrets`) and **`ELDER_URL`**.
- NetworkPolicy must allow `app: openclaw-openclaw`, `component: openclaw` → Elder port 8000.

### 3. Skills

`gmail-skill.md` in `openclaw-skills` ConfigMap documents `curl` examples with `X-API-Key`.

## Usage Tips (avoid context overflow)

- List with **`max_results: 5–10`**; summarize **snippets** only.
- Use `/new` before large mail tasks.
- Confirm recipient/subject/body before **send**.

## Verification

```bash
ELDER_KEY=$(kubectl get secret elder-secrets -n openclaw -o jsonpath='{.data.API_KEY}' | base64 -d)

kubectl exec -n openclaw deploy/openclaw -- sh -c \
  "curl -sS -X POST \"\${ELDER_URL}/api/gmail/list\" \
    -H \"X-API-Key: \${ELDER_API_KEY}\" \
    -H \"Content-Type: application/json\" \
    -d '{\"query\":\"is:unread\",\"max_results\":3}'"
```

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/GMAIL_SETUP.md`
- `pi-fleet/clusters/eldertree/openclaw/skills-configmap.yaml`
- `elder/backend/api/routes/gmail.py`
