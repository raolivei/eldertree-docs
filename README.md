# ElderTree Documentation

**Comprehensive documentation for the ElderTree Kubernetes cluster** — learn how it works, understand the architecture, troubleshoot issues, and explore the platform.

## Purpose

This is **not just a runbook** — it's the complete knowledge base for ElderTree:

- 📚 **Learning** - Understand cluster architecture, design decisions, and patterns
- 🏗️ **Architecture** - System design, infrastructure layers, service mesh
- 🔧 **Operations** - Day-to-day management, deployments, monitoring
- 🔍 **Troubleshooting** - Incident response, known issues, debugging guides
- 📖 **Reference** - Configuration details, network topology, hardware specs

## Access

| URL | Description |
|-----|-------------|
| https://docs.eldertree.xyz | Public access via GitHub Pages |
| https://docs.eldertree.local | Local network access via Kubernetes |

## What You'll Find Here

### Architecture & Design
- Cluster topology (3-node HA K3s on Pi 5)
- Network architecture (dual-interface, VIPs, CNI)
- Storage strategy (Longhorn, Vault, NVMe)
- Node scheduling policies (workload placement, taints, affinity)
- Observability stack (Prometheus, Grafana, Loki)

### Operations
- Deployment workflows (GitOps with Flux)
- Configuration management (Ansible, Terraform)
- Secrets management (Vault)
- Monitoring and alerting
- Backup and disaster recovery

### Troubleshooting
- Searchable incident runbook (DNS, boot, network, storage, SSH)
- Error message index
- Root cause analysis from past incidents
- Agent-compatible resolution guides

### Hardware
- Physical setup (chassis, power, networking)
- Node specifications
- NVMe boot configuration
- PoE+ power delivery

## Quick Start

**For Humans:**  
Use search (`/` or `Ctrl+K`) to find what you need.

**For AI Agents:**  
See [Agent Workflow](/runbook/workflow) for structured incident resolution.

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
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
│   ├── index.md         # Runbook overview & issue index
│   ├── workflow.md      # Agent troubleshooting workflow
│   ├── node-scheduling.md  # Node scheduling tier policy
│   ├── hardware/        # Hardware documentation
│   └── issues/          # Known issues by category
│       ├── dns/         # DNS, CoreDNS, Pi-hole
│       ├── cloudflare/  # Tunnel, origin certs
│       ├── ha/          # HA failover, cluster recovery
│       ├── node/        # Node health, k3s issues
│       ├── boot/        # Boot failures, NVMe
│       ├── network/     # Network connectivity
│       ├── storage/     # Vault, Longhorn
│       ├── ssh/         # SSH access
│       ├── cicd/        # GitHub Actions, workflows
│       └── openclaw/    # OpenClaw gateway
├── project.md           # Project overview, repos, live status
├── scripts/             # Utility scripts
├── Dockerfile           # Kubernetes deployment
└── index.md             # Homepage
```

## Related Projects

| Repository | Purpose |
|------------|---------|
| [pi-fleet](https://github.com/raolivei/pi-fleet) | Infrastructure code (Ansible, Flux, Helm, Terraform) |
| [eldertree-chassis](https://github.com/raolivei/eldertree-chassis) | Mechanical CAD, BOM, assembly guide |
| [eldertree-docs](https://github.com/raolivei/eldertree-docs) | This documentation site |
| [pi-fleet-blog](https://github.com/raolivei/pi-fleet-blog) | Build diary and technical blog |

## Contributing

Documentation improvements welcome! This is a living knowledge base.

## License

MIT
