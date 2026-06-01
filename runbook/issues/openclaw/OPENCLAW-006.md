---
id: OPENCLAW-006
title: Tool Call Schema Failures (Groq Llama Scout)
category: openclaw
severity: medium
symptoms:
  - tool call validation failed exec parameters did not match schema
  - pty background elevated expected boolean but got string
  - kubectl or curl commands never run from Telegram
---

# OPENCLAW-006: Tool Call Schema Failures (Groq Llama Scout)

## Symptoms

Telegram shows:

```text
tool call validation failed: parameters for tool exec did not match schema:
errors: [/pty: expected boolean, but got string, /background: expected boolean, but got string,
/elevated: expected boolean, but got string]
```

User asked for kubectl logs or similar; agent never executes.

## Error Messages (Searchable)

- `tool call validation failed`
- `expected boolean, but got string`
- `/pty: expected boolean`
- `/elevated: expected boolean`

## Root Cause

Smaller models (e.g. **`groq/meta-llama/llama-4-scout-17b-16e-instruct`**) emit tool arguments as **strings** (`"true"`) instead of JSON **booleans** (`true`). OpenClaw's `exec` tool schema rejects them.

## Resolution

Switch primary to a model with reliable function calling:

- **`groq/openai/gpt-oss-120b`** (recommended on Eldertree — higher TPM, GPT-style tools)
- **`groq/llama-3.3-70b-versatile`** (better than Scout; watch TPM limits — [OPENCLAW-003](/runbook/issues/openclaw/OPENCLAW-003))

Update `agents.defaults.model.primary` in `configmap.yaml`, Flux reconcile, restart OpenClaw.

## Verification

Ask Telegram: *"Show me pods in namespace swimto"* — should run `kubectl` without schema error.

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/configmap.yaml`
