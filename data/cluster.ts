/** Static Eldertree cluster manifest — source: pi-fleet/docs/ELDERTREE.md
 *
 * ClusterGlance badge semantics (see useClusterNodeStatus.ts):
 * - Live: K8s node Ready=True → "stable"; Ready=False → "unstable".
 * - Fallback chain: Elder GET /api/public/cluster/nodes → public/cluster-status.json → tiers below.
 * - Static tiers here reflect operational intent (node-1 deprioritized / soft-tainted), not live Ready.
 *   Refresh cluster-status.json locally: scripts/sync-cluster-status.sh (requires kubectl + LAN cluster).
 */

export type NodeTier = "stable" | "unstable";

export interface ClusterNode {
  id: string;
  hostname: string;
  wlan0: string;
  eth0: string;
  tier: NodeTier;
  roles: string[];
}

export interface ClusterVip {
  label: string;
  ip: string;
  purpose: string;
}

export const cluster = {
  name: "Eldertree",
  k3sVersion: "v1.35.0+k3s1",
  os: "Debian 13 (trixie)",
  hardware: "3× Raspberry Pi 5 (8GB), NVMe boot, PoE+ HAT",
  nodes: [
    {
      id: "node-1",
      hostname: "node-1.eldertree.local",
      wlan0: "192.168.2.101",
      eth0: "10.0.0.1",
      tier: "unstable",
      roles: ["control-plane", "etcd"],
    },
    {
      id: "node-2",
      hostname: "node-2.eldertree.local",
      wlan0: "192.168.2.102",
      eth0: "10.0.0.2",
      tier: "stable",
      roles: ["control-plane", "etcd"],
    },
    {
      id: "node-3",
      hostname: "node-3.eldertree.local",
      wlan0: "192.168.2.103",
      eth0: "10.0.0.3",
      tier: "stable",
      roles: ["control-plane", "etcd"],
    },
  ] satisfies ClusterNode[],
  vips: [
    { label: "API", ip: "192.168.2.100", purpose: "kube-vip HA" },
    { label: "Ingress", ip: "192.168.2.200", purpose: "Traefik *.eldertree.local" },
    { label: "DNS", ip: "192.168.2.201", purpose: "BIND9 LB" },
  ] satisfies ClusterVip[],
} as const;
