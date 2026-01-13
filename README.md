# Eldertree Docs

Documentation and incident runbook for the eldertree Kubernetes cluster.

## Overview

This VitePress-based site provides:

- **Searchable Runbook** - Troubleshooting guides with exact error messages for text search
- **Agent-Compatible** - Structured format for AI agents to quickly find and resolve issues
- **Dual Deployment** - Available via GitHub Pages (public) and Kubernetes (local network)

## Access

| URL | Description |
|-----|-------------|
| https://docs.eldertree.xyz | Public access via GitHub Pages |
| https://docs.eldertree.local | Local network access via Kubernetes |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

```
eldertree-docs/
├── .vitepress/          # VitePress configuration
│   ├── config.ts        # Site configuration
│   └── sidebar.ts       # Navigation sidebar
├── .github/workflows/   # CI/CD for GitHub Pages + Docker
├── runbook/
│   ├── index.md         # Runbook overview & symptom table
│   ├── workflow.md      # Agent instructions
│   └── issues/          # Issue files by category
│       ├── dns/         # DNS-001, PIHOLE-001
│       ├── cloudflare/  # CF-001
│       ├── node/        # NODE-001 to NODE-004, K3S-001
│       ├── boot/        # BOOT-001 to BOOT-004, EMERG-001 to EMERG-004
│       ├── network/     # NET-001 to NET-004
│       ├── storage/     # VAULT-001
│       └── ssh/         # SSH-001 to SSH-003
├── scripts/             # Migration and utility scripts
├── Dockerfile           # For Kubernetes deployment
└── index.md             # Homepage
```

## Issue File Format

Each issue file uses YAML frontmatter for metadata and includes:

```markdown
---
id: CATEGORY-NNN
title: Short Description
category: category-name
severity: critical|high|medium|low
symptoms:
  - searchable symptom text
source: original-file.md (if migrated)
---

# CATEGORY-NNN: Short Description

## Error Messages (Searchable)
- `exact error message for search`

## Resolution
Step-by-step fix instructions.

## Verification
Commands to confirm the fix.
```

## How Agents Use This

1. **Search** for error text using VitePress local search
2. **Find** matching issue files
3. **Follow** resolution steps
4. **Verify** using provided commands

## Related

- [pi-fleet](https://github.com/raolivei/pi-fleet) - Infrastructure code
- [pi-fleet-blog](https://github.com/raolivei/pi-fleet-blog) - Build diary

## License

MIT
