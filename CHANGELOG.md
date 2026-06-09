# Changelog

All notable changes to the eldertree-docs project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning

While in **pre-1.0** development:

- MINOR version bumps may include breaking changes
- PATCH version bumps are for backwards-compatible bug fixes

After **1.0.0** release:

- MAJOR version bumps for breaking changes
- MINOR version bumps for new features (backwards-compatible)
- PATCH version bumps for bug fixes (backwards-compatible)

## [Unreleased]

### Changed

- **Cluster at a glance:** link to Eldertree Control Center (`control.eldertree.local`, LAN/Tailscale) in the ops links row.
- **Home hero logo** — larger mark (280px) and vertical alignment with the headline on wide layouts.

### Added

- **Cluster at a glance** on the home page — same widget as [pi-fleet-blog](https://blog.eldertree.xyz/) with indigo styling; live node status via Elder public API or [`public/cluster-status.json`](public/cluster-status.json).
- **Eldertree logo** — icon-only mark in VitePress indigo (`#a8b1ff` / `#5c73e7` / `#3e63dd`); nav, favicon, and home hero. Source: `assets/logo-source.png`; regenerate with `python3 scripts/recolor-logo.py` (requires Pillow).
- **`scripts/sync-cluster-status.sh`** — optional kubectl refresh of `public/cluster-status.json` (deploy workflow runs it; skips when cluster unreachable in GHA).

### Changed

- **Docs:** [`cluster-status.md`](cluster-status.md) — home-page glance widget, sync script, links to Elder API and blog ops doc.
- **Deploy workflow:** pre-build sync step for cluster-status (falls back to committed JSON in CI).
- **`.npmrc`** — pin public npm registry (avoids corporate CodeArtifact E401 on personal machines).
- **Home hero logo** — 512×512 icon crop (wordmark excluded), softer glow, `overflow: visible` so the mark is not clipped.

### Fixed

- **GitHub Pages deploy** — restore `static-site-pages.yml` caller in `github-workflows`; per-job permissions in `deploy.yml` so Pages publish works again (HA-001 and other runbooks were 404 on docs.eldertree.xyz).

### Added

- **OpenClaw runbook (OPENCLAW-002–009)** — Documented Eldertree production issues: token vs trusted-proxy WebSocket 1008, context overflow / OpenRouter 402 / Groq TPM, Telegram 409 and egress, config EBUSY / PVC seeding, Groq tool schema errors, Gmail via Elder, accidental Deployment delete / Helm drift, OOM/heap. Updated OPENCLAW-001 for current token-auth standard.
- Initial VitePress documentation site structure
- Runbook system with searchable issue files
- Migration of troubleshooting docs from pi-fleet
- Dual deployment support (GitHub Pages + Kubernetes)
- **NET-006**: Tailscale/k3s routing table conflict runbook entry
  - Documents routing table 52 conflict with k3s CNI
  - Includes diagnosis, resolution, and systemd persistence fix
  - Cross-references SwimTO troubleshooting docs
- **HA-001**: Node Failure and HA Cluster Recovery (2026-01-27)
  - Complete guide for recovering from node failures in 3-node HA cluster
  - Covers Vault HA failover, Longhorn volume recovery, PDB issues
  - Documents optimal Longhorn replica settings (2 replicas for 3-node cluster)
  - Includes PodDisruptionBudget configuration for graceful drains
- **LONGHORN-001**: Longhorn Storage Troubleshooting (2026-01-27)
  - Multi-Attach error recovery after node failure
  - Volume degraded state resolution
  - Instance-manager PDB drain issues
  - Recommended settings for 3-node HA clusters
- **CF-002**: Cloudflare Origin Certificates Setup (2026-01-27)
  - Terraform-based origin certificate generation
  - Vault storage and ExternalSecrets integration
  - Ingress TLS configuration
  - Troubleshooting 502 errors with Full (strict) SSL mode
