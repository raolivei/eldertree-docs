export function sidebar() {
  return {
    "/": [
      {
        text: "Introduction",
        link: "/",
      },
    ],
    "/runbook/": [
      {
        text: "Runbook Overview",
        link: "/runbook/",
      },
      {
        text: "Agent Workflow",
        link: "/runbook/workflow",
      },
      {
        text: "DNS Issues",
        collapsed: false,
        items: [
          {
            text: "DNS-001: CoreDNS Troubleshooting",
            link: "/runbook/issues/dns/DNS-001",
          },
          {
            text: "PIHOLE-001: Pi-hole DNS",
            link: "/runbook/issues/dns/PIHOLE-001",
          },
        ],
      },
      {
        text: "Cloudflare Issues",
        collapsed: false,
        items: [
          {
            text: "CF-001: Tunnel Troubleshooting",
            link: "/runbook/issues/cloudflare/CF-001",
          },
          {
            text: "CF-002: Origin Certificates",
            link: "/runbook/issues/cloudflare/CF-002",
          },
        ],
      },
      {
        text: "HA & Failover",
        collapsed: false,
        items: [
          {
            text: "HA-001: Node Failure Recovery",
            link: "/runbook/issues/ha/HA-001",
          },
        ],
      },
      {
        text: "Node Issues",
        collapsed: false,
        items: [
          {
            text: "NODE-001: General Troubleshooting",
            link: "/runbook/issues/node/NODE-001",
          },
          {
            text: "NODE-002: Recurring Issues",
            link: "/runbook/issues/node/NODE-002",
          },
          {
            text: "NODE-003: Root Cause Analysis",
            link: "/runbook/issues/node/NODE-003",
          },
          {
            text: "NODE-004: Troubleshooting Summary",
            link: "/runbook/issues/node/NODE-004",
          },
          {
            text: "K3S-001: K3s Service Issues",
            link: "/runbook/issues/node/K3S-001",
          },
        ],
      },
      {
        text: "Boot Issues",
        collapsed: false,
        items: [
          { text: "BOOT-001: Boot Fix", link: "/runbook/issues/boot/BOOT-001" },
          {
            text: "BOOT-002: Boot Reliability",
            link: "/runbook/issues/boot/BOOT-002",
          },
          {
            text: "BOOT-003: NVMe Boot",
            link: "/runbook/issues/boot/BOOT-003",
          },
          {
            text: "BOOT-004: Initramfs Fix",
            link: "/runbook/issues/boot/BOOT-004",
          },
        ],
      },
      {
        text: "Emergency Recovery",
        collapsed: false,
        items: [
          {
            text: "EMERG-001: Emergency Mode Recovery",
            link: "/runbook/issues/boot/EMERG-001",
          },
          {
            text: "EMERG-002: Emergency No Keyboard",
            link: "/runbook/issues/boot/EMERG-002",
          },
          {
            text: "EMERG-003: Recovery from SD Card",
            link: "/runbook/issues/boot/EMERG-003",
          },
          {
            text: "EMERG-004: SD Card Recovery",
            link: "/runbook/issues/boot/EMERG-004",
          },
        ],
      },
      {
        text: "Network Issues",
        collapsed: false,
        items: [
          {
            text: "NET-001: Network Recovery",
            link: "/runbook/issues/network/NET-001",
          },
          {
            text: "NET-002: Node 1 Network",
            link: "/runbook/issues/network/NET-002",
          },
          {
            text: "NET-003: Post-Netplan Fix",
            link: "/runbook/issues/network/NET-003",
          },
          {
            text: "NET-004: Prevention",
            link: "/runbook/issues/network/NET-004",
          },
        ],
      },
      {
        text: "Storage Issues",
        collapsed: false,
        items: [
          {
            text: "VAULT-001: Vault Recovery",
            link: "/runbook/issues/storage/VAULT-001",
          },
          {
            text: "LONGHORN-001: Longhorn Storage",
            link: "/runbook/issues/storage/LONGHORN-001",
          },
        ],
      },
      {
        text: "SSH Issues",
        collapsed: false,
        items: [
          {
            text: "SSH-001: Permission Denied",
            link: "/runbook/issues/ssh/SSH-001",
          },
          {
            text: "SSH-002: SSH Recovery",
            link: "/runbook/issues/ssh/SSH-002",
          },
          {
            text: "SSH-003: Locked Root Recovery",
            link: "/runbook/issues/ssh/SSH-003",
          },
        ],
      },
      {
        text: "CI/CD Issues",
        collapsed: false,
        items: [
          {
            text: "CICD-001: Reusable Workflows",
            link: "/runbook/issues/cicd/CICD-001",
          },
        ],
      },
    ],
  };
}
