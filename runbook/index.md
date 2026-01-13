# Runbook Overview

This runbook contains documented solutions for known issues in the eldertree Kubernetes cluster. Each issue includes:

- **Symptoms** - How to identify this issue
- **Error Messages** - Exact error text for searchability
- **Resolution** - Step-by-step fix instructions
- **Verification** - Commands to confirm the fix worked

## Quick Reference

### By Symptom

| Symptom | Possible Issues |
|---------|-----------------|
| HTTP 530 from Cloudflare | [CF-001](/runbook/issues/cloudflare/CF-001) |
| `dial udp 10.43.0.10:53 i/o timeout` | [CF-001](/runbook/issues/cloudflare/CF-001), [DNS-001](/runbook/issues/dns/DNS-001) |
| CoreDNS pod not running | [DNS-001](/runbook/issues/dns/DNS-001) |
| nslookup fails inside pods | [DNS-001](/runbook/issues/dns/DNS-001), [PIHOLE-001](/runbook/issues/dns/PIHOLE-001) |
| Node unreachable | [NODE-001](/runbook/issues/node/NODE-001), [NET-001](/runbook/issues/network/NET-001) |
| Node has multiple IPs | [NODE-002](/runbook/issues/node/NODE-002), [NODE-003](/runbook/issues/node/NODE-003) |
| Boot failure / emergency mode | [BOOT-001](/runbook/issues/boot/BOOT-001), [EMERG-001](/runbook/issues/boot/EMERG-001) |
| NVMe boot issues | [BOOT-003](/runbook/issues/boot/BOOT-003) |
| SSH permission denied | [SSH-001](/runbook/issues/ssh/SSH-001) |
| Root account locked | [SSH-003](/runbook/issues/ssh/SSH-003) |
| Vault sealed / unavailable | [VAULT-001](/runbook/issues/storage/VAULT-001) |
| K3s service not starting | [K3S-001](/runbook/issues/node/K3S-001) |
| Network connectivity lost | [NET-001](/runbook/issues/network/NET-001), [NET-002](/runbook/issues/network/NET-002) |
| Netplan configuration issues | [NET-003](/runbook/issues/network/NET-003) |

### By Category

#### DNS Issues
- [DNS-001: CoreDNS Troubleshooting](/runbook/issues/dns/DNS-001)
- [PIHOLE-001: Pi-hole DNS Issues](/runbook/issues/dns/PIHOLE-001)

#### Cloudflare Issues
- [CF-001: Cloudflare Tunnel Troubleshooting](/runbook/issues/cloudflare/CF-001)

#### Node Issues
- [NODE-001: General Node Troubleshooting](/runbook/issues/node/NODE-001)
- [NODE-002: Recurring Node Issues](/runbook/issues/node/NODE-002)
- [NODE-003: Node Root Cause Analysis](/runbook/issues/node/NODE-003)
- [NODE-004: Node Troubleshooting Summary](/runbook/issues/node/NODE-004)
- [K3S-001: K3s Service Troubleshooting](/runbook/issues/node/K3S-001)

#### Boot Issues
- [BOOT-001: Boot Fix](/runbook/issues/boot/BOOT-001)
- [BOOT-002: Boot Reliability Fix](/runbook/issues/boot/BOOT-002)
- [BOOT-003: NVMe Boot Troubleshooting](/runbook/issues/boot/BOOT-003)
- [BOOT-004: Initramfs Fix](/runbook/issues/boot/BOOT-004)

#### Emergency Recovery
- [EMERG-001: Emergency Mode Recovery](/runbook/issues/boot/EMERG-001)
- [EMERG-002: Emergency Mode No Keyboard](/runbook/issues/boot/EMERG-002)
- [EMERG-003: Recovery from SD Card](/runbook/issues/boot/EMERG-003)
- [EMERG-004: SD Card Recovery](/runbook/issues/boot/EMERG-004)

#### Network Issues
- [NET-001: Network Connectivity Recovery](/runbook/issues/network/NET-001)
- [NET-002: Node 1 Network Recovery](/runbook/issues/network/NET-002)
- [NET-003: Post-Netplan Fix](/runbook/issues/network/NET-003)
- [NET-004: Preventing Network Issues](/runbook/issues/network/NET-004)

#### Storage Issues
- [VAULT-001: Vault Recovery](/runbook/issues/storage/VAULT-001)

#### SSH Issues
- [SSH-001: SSH Permission Denied](/runbook/issues/ssh/SSH-001)
- [SSH-002: SSH Recovery](/runbook/issues/ssh/SSH-002)
- [SSH-003: Locked Root Recovery](/runbook/issues/ssh/SSH-003)

## Adding New Issues

When documenting a new issue, use this template:

```markdown
---
id: CATEGORY-NNN
title: Short Description
category: category-name
severity: critical|high|medium|low
symptoms:
  - symptom 1
  - symptom 2
source: original-file-if-migrated.md
---

# CATEGORY-NNN: Short Description

## Symptoms

- Observable symptom 1
- Observable symptom 2

## Error Messages (Searchable)

Include exact error text for search:

- `exact error message 1`
- `exact error message 2`

## Diagnosis

Steps to confirm this is the issue.

## Resolution

Step-by-step fix instructions.

## Verification

Commands to verify the fix worked.

## Related Issues

- [RELATED-001](/runbook/issues/category/RELATED-001)
```
