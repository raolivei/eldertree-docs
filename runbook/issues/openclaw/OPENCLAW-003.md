---
id: OPENCLAW-003
title: LLM Context Overflow and Provider Limits (402 / TPM)
category: openclaw
severity: high
symptoms:
  - Context overflow prompt too large for the model
  - OpenRouter 402 insufficient credits or max_tokens
  - Groq 413 Request too large TPM Limit 12000
  - Auto-compaction failed
  - Elder stops replying after long Telegram threads
---

# OPENCLAW-003: LLM Context Overflow and Provider Limits (402 / TPM)

## Symptoms

- Telegram: **"Context overflow: prompt too large for the model"** — try `/reset` or `/new`.
- **"Auto-compaction could not recover this turn"** after overflow.
- Logs: `402 Prompt tokens limit exceeded` or `402 Insufficient credits`.
- Groq: `413 Request too large ... TPM: Limit 12000, Requested 45005`.
- Failover loops across models without a successful reply.

## Error Messages (Searchable)

- `Context overflow: prompt too large`
- `402 Prompt tokens limit exceeded`
- `402 Insufficient credits`
- `auto-compaction failed`
- `reserveTokensFloor`
- `TPM: Limit 12000`
- `FailoverError: API rate limit reached`

## Root Causes

| Cause | What happens |
|-------|----------------|
| **Huge session on PVC** | 297+ messages; prompt exceeds provider cap even after `/new` confusion |
| **OpenRouter billing** | Free/low balance; large `max_tokens` or prompt over route limit (~25k for some models) |
| **Groq free tier TPM** | `llama-3.3-70b-versatile` on-demand tier ~12k TPM; 45k-token session fails every request |
| **`contextTokens` too low vs `reserveTokensFloor`** | e.g. 22k context + 20k floor → only ~2k usable; overflow on first message |
| **Pasting large logs in Telegram** | Inflates session immediately |

## Resolution

### 1. Start fresh

In Telegram: **`/new`** or **`/reset`**. If the session file on PVC is huge, archive it (see pi-fleet openclaw ops) and restart the pod.

### 2. Tune `agents.defaults` in ConfigMap

Recommended starting points (adjust per primary model):

```json
"contextTokens": 80000,
"compaction": {
  "mode": "safeguard",
  "reserveTokensFloor": 20000,
  "model": "<same provider as primary or cheaper Groq model>",
  "memoryFlush": { "enabled": false }
}
```

- **`reserveTokensFloor: 20000`** — Elder/OpenClaw suggests this when compaction cannot run.
- Do **not** set `contextTokens` below ~32k if `reserveTokensFloor` is 20k.

### 3. Pick a viable primary model

| Model | Notes |
|-------|--------|
| `groq/openai/gpt-oss-120b` | Higher TPM (250k); good tool calling |
| `groq/llama-3.3-70b-versatile` | Strong but **12k TPM** on free on-demand tier — bad for large sessions |
| `groq/meta-llama/llama-4-scout-17b-16e-instruct` | Higher TPM; weaker tool-call JSON (see OPENCLAW-006) |
| OpenRouter routes | Require credits at [openrouter.ai/settings/credits](https://openrouter.ai/settings/credits) |

Catalog `contextWindow` for OpenRouter Gemini should reflect **real** route limits (~24k), not 1M marketing numbers.

### 4. Keep email / kubectl output small

When reading mail or logs via tools, cap results (e.g. **5–10** messages, snippets only). See [OPENCLAW-007](/runbook/issues/openclaw/OPENCLAW-007).

## Verification

```bash
kubectl logs -n openclaw deployment/openclaw --tail=50 | grep -iE 'overflow|402|TPM|compaction'
```

Send a **short** test message in Telegram after `/new`; gateway should log a successful agent run.

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/configmap.yaml`
