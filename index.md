---
layout: home
hero:
  name: Eldertree Docs
  text: Cluster Runbook & Documentation
  tagline: Searchable incident management for the eldertree Kubernetes cluster
  actions:
    - theme: brand
      text: View Runbook
      link: /runbook/
    - theme: alt
      text: Agent Workflow
      link: /runbook/workflow
features:
  - icon: 🔍
    title: Searchable Issues
    details: Full-text search across all known issues, error messages, and symptoms
  - icon: 🤖
    title: Agent-Compatible
    details: Structured format designed for AI agents to quickly find and resolve issues
  - icon: 📚
    title: Documented Solutions
    details: Step-by-step resolution guides with verification commands
---

# Welcome to Eldertree Docs

This documentation site serves as the incident runbook for the **eldertree** Kubernetes cluster - a k3s cluster running on Raspberry Pi hardware.

## Quick Links

- [**Runbook Overview**](/runbook/) - Browse all known issues by category
- [**Agent Workflow**](/runbook/workflow) - Instructions for AI agents on how to use this runbook
- [**pi-fleet Repository**](https://github.com/raolivei/pi-fleet) - Infrastructure code and setup guides

## How to Use

### For Humans

Use the search bar (press `/` or `Ctrl+K`) to search for error messages or symptoms you're experiencing.

### For AI Agents

1. Search the runbook using the error text or symptom
2. Find matching issue files
3. Follow the resolution steps
4. Verify the fix using the provided commands

## Issue Categories

| Category | Description |
|----------|-------------|
| DNS | CoreDNS, Pi-hole, and DNS resolution issues |
| Cloudflare | Tunnel, DNS, and external access issues |
| Node | Node health, dual IP, and cluster membership |
| Boot | Boot failures, NVMe, and system startup |
| Network | Network connectivity and recovery |
| Storage | Vault, Longhorn, and persistent storage |
| SSH | SSH access and authentication |


