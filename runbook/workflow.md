# Agent Workflow

This document describes how AI agents should use this runbook to diagnose and resolve issues in the eldertree cluster.

## Search Strategy

### Primary Method: Text Search

When you encounter an error or issue:

1. **Copy the exact error message** from logs or terminal output
2. **Search this runbook** using VitePress search (the search indexes all content)
3. **Review matching issues** - multiple issues may match the same symptom
4. **Follow the resolution steps** in the matched issue file

### Search Tips

- Search for **exact error text** in quotes for best matches
- Try searching for **key phrases** if exact match doesn't work
- Search for **symptoms** like "node unreachable" or "DNS timeout"
- Check the **symptom table** on the [Runbook Overview](/runbook/) page

## Workflow Steps

```
┌─────────────────────────────────────────────────────────────┐
│ 1. IDENTIFY: Capture exact error message or symptom         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SEARCH: Query runbook with error text                    │
│    - Use VitePress search (Ctrl+K or /)                     │
│    - Check symptom table in /runbook/                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. MATCH: Review search results                             │
│    - Read issue symptoms section                            │
│    - Confirm error messages match                           │
│    - If no match, this may be a new issue                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DIAGNOSE: Follow diagnosis steps in issue file           │
│    - Run diagnostic commands                                │
│    - Gather additional context                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. RESOLVE: Execute resolution steps                        │
│    - Follow steps in order                                  │
│    - Note any deviations                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. VERIFY: Run verification commands                        │
│    - Confirm issue is resolved                              │
│    - Document any remaining issues                          │
└─────────────────────────────────────────────────────────────┘
```

## Example: DNS Timeout Issue

**Scenario**: User reports that `curl https://pitanga.cloud` returns HTTP 530

**Agent Workflow**:

1. **Search** runbook for "HTTP 530"
2. **Find** [CF-001: Cloudflare Tunnel DNS Timeout](/runbook/issues/cloudflare/CF-001)
3. **Read** the issue - confirms DNS timeout from cloudflared pod
4. **Diagnose** - Check cloudflared logs, verify CoreDNS pods
5. **Resolve** - Follow the steps (restart CoreDNS, check Pi-hole)
6. **Verify** - Run `curl -I https://pitanga.cloud` - should return 200

## When No Match Found

If searching doesn't find a matching issue:

1. This may be a **new issue** not yet documented
2. Gather diagnostic information:
   - Exact error messages
   - Affected pods/nodes
   - Recent changes
   - Time of occurrence
3. Troubleshoot using standard Kubernetes debugging
4. **Document the new issue** in the runbook for future reference

## Issue File Structure

Each issue file contains:

| Section | Purpose |
|---------|---------|
| Frontmatter | Metadata (id, category, severity, symptoms) |
| Symptoms | Observable behaviors indicating this issue |
| Error Messages | Exact error text (searchable) |
| Diagnosis | Steps to confirm the issue |
| Resolution | Step-by-step fix instructions |
| Verification | Commands to confirm the fix |
| Related Issues | Links to similar/related problems |

## Access Points

This runbook is available at:

- **Public**: [https://docs.eldertree.xyz](https://docs.eldertree.xyz)
- **Local**: [https://docs.eldertree.local](https://docs.eldertree.local) (within eldertree network)


