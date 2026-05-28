---
layout: home
hero:
  name: ElderTree Docs
  text: Learn • Operate • Troubleshoot
  tagline: Comprehensive documentation for the ElderTree Kubernetes cluster
  actions:
    - theme: brand
      text: Project Overview
      link: /project
    - theme: alt
      text: Runbook
      link: /runbook/
    - theme: alt
      text: Node Scheduling
      link: /runbook/node-scheduling
features:
  - icon: 📚
    title: Learning & Architecture
    details: Understand how ElderTree works — cluster design, network topology, storage strategy, and infrastructure patterns
  - icon: 🔧
    title: Operations
    details: Day-to-day management, GitOps workflows, monitoring, deployments, and configuration management
  - icon: 🔍
    title: Troubleshooting
    details: Searchable runbook with known issues, error messages, resolution steps, and root cause analysis
  - icon: 🤖
    title: Agent-Compatible
    details: Structured documentation designed for both humans and AI agents to quickly navigate and resolve issues
---

# Welcome to ElderTree Documentation

**ElderTree** is a 3-node HA K3s cluster running on Raspberry Pi 5 hardware. This is the comprehensive knowledge base — not just a runbook, but complete documentation for learning, operating, and troubleshooting the platform.

## What's Here

### 🏗️ [Project Overview](/project)
Cluster map, live Grafana dashboards, hardware specs, repositories, and network topology.

### 💻 Develop on your Mac
- [Ollie workspace setup](/guides/ollie-workspace-setup) — shared Cursor + Claude Code memories, session handoff

### 🔧 Operations & Architecture
- [Node Scheduling Tiers](/runbook/node-scheduling) — automated workload placement policy
- [Hardware & Chassis](/runbook/hardware/chassis) — physical setup and assembly
- GitOps workflows (Flux, Ansible, Terraform)
- Secrets management (Vault)
- Observability stack (Prometheus, Grafana, Loki)

### 🔍 [Incident Runbook](/runbook/)
Searchable troubleshooting guides organized by category:

| Category | Coverage |
|----------|----------|
| **DNS** | CoreDNS, Pi-hole resolution, timeout issues |
| **Cloudflare** | Tunnel connectivity, origin certificates, SSL |
| **HA & Failover** | Node failure recovery, Longhorn, PDBs |
| **Node** | Node health, k3s service issues, cluster membership |
| **Boot** | NVMe boot, initramfs, emergency mode recovery |
| **Network** | Connectivity, routing tables, dual-interface setup |
| **Storage** | Vault recovery, Longhorn volumes |
| **SSH** | Permission denied, locked root, key access |
| **CI/CD** | GitHub Actions, reusable workflows |
| **OpenClaw** | Gateway configuration, Elder integration |

## Quick Start

**Search** — Press `/` or `Ctrl+K` to search for error messages, symptoms, or topics.

**Live Dashboards** — Access [Grafana](https://grafana.eldertree.local) for real-time cluster monitoring (requires home LAN or Tailscale).

**Infrastructure Code** — See [pi-fleet](https://github.com/raolivei/pi-fleet) for Ansible, Flux, Helm charts, and Terraform.

## For AI Agents

Structured workflow for incident resolution: [Agent Workflow](/runbook/workflow)

1. Search for error text or symptom
2. Locate matching issue file
3. Execute resolution steps
4. Verify fix with provided commands

## About ElderTree

- **Hardware:** 3× Raspberry Pi 5 (8GB, NVMe boot, PoE+)
- **Network:** Dual-interface (10.0.0.0/24 cluster backbone, 192.168.2.0/24 WiFi management)
- **HA Setup:** 3-node control plane, kube-vip VIP, embedded etcd
- **Storage:** NVMe local, Longhorn distributed block storage, Vault for secrets
- **Monitoring:** Prometheus, Grafana, Loki, Node Exporter, cAdvisor
- **GitOps:** FluxCD syncs from [pi-fleet](https://github.com/raolivei/pi-fleet)

**Explore:** [Full project overview →](/project)

