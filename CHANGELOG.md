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

### Added
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


