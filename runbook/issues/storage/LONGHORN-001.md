---
id: LONGHORN-001
title: Longhorn Storage Troubleshooting
category: storage
severity: high
date: 2026-01-27
symptoms:
  - Multi-Attach error for volume
  - Volume stuck in attaching
  - Volume degraded
  - Pod stuck in ContainerCreating
  - instance-manager PDB blocking drain
---

# LONGHORN-001: Longhorn Storage Troubleshooting

## Error Messages (Searchable)

```
Multi-Attach error for volume "pvc-xxx" Volume is already attached to node
AttachVolume.Attach failed for volume "pvc-xxx": rpc error: code = Aborted
Volume is in attaching state
Cannot evict pod as it would violate the pod's disruption budget (instance-manager)
Volume degraded
```

## Common Issues

### 1. Multi-Attach Error After Node Failure

**Symptoms:**
- Pod stuck in `ContainerCreating`
- Event shows "Multi-Attach error for volume"
- Old node is NotReady but volume still attached

**Solution:**

```bash
export KUBECONFIG=~/.kube/config-eldertree

# 1. Find the stuck volume
kubectl get volumeattachment | grep <pvc-name>

# 2. Check Longhorn volume status
kubectl get volumes.longhorn.io -n longhorn-system

# 3. Force detach from dead node
kubectl patch volumes.longhorn.io <volume-name> -n longhorn-system \
  --type=merge -p '{"spec":{"nodeID":""}}'

# 4. Delete the stuck VolumeAttachment
kubectl delete volumeattachment <attachment-name>

# 5. Delete and recreate the pod (it will reattach)
kubectl delete pod <pod-name> -n <namespace> --force --grace-period=0
```

### 2. Volume Degraded State

**Symptoms:**
- `kubectl get volumes.longhorn.io` shows `ROBUSTNESS: degraded`
- One node is down or has storage issues

**Cause:**
With 3 replicas on 3 nodes, losing 1 node = only 2/3 replicas available = degraded.

**Solution - Change to 2 Replicas:**

```bash
# Update all volumes to use 2 replicas
for vol in $(kubectl get volumes.longhorn.io -n longhorn-system -o jsonpath='{.items[*].metadata.name}'); do
  kubectl patch volumes.longhorn.io "$vol" -n longhorn-system \
    --type=merge -p '{"spec":{"numberOfReplicas":2}}'
done

# Verify volumes are now healthy
kubectl get volumes.longhorn.io -n longhorn-system \
  -o custom-columns='NAME:.metadata.name,STATE:.status.state,ROBUSTNESS:.status.robustness,REPLICAS:.spec.numberOfReplicas'
```

### 3. Instance Manager PDB Blocking Node Drain

**Symptoms:**
- `kubectl drain` hangs forever
- Error: "Cannot evict pod as it would violate the pod's disruption budget"
- Pod is `longhorn-system/instance-manager-xxx`

**Cause:**
Longhorn creates a PDB for each instance-manager pod with minAvailable=1.

**Solution:**

```bash
# Option 1: Set proper node-drain-policy (recommended)
kubectl patch settings.longhorn.io node-drain-policy -n longhorn-system \
  --type=merge -p '{"value":"block-if-contains-last-replica"}'

# Option 2: Force drain (bypasses PDBs - use with caution)
kubectl drain <node> --delete-emptydir-data --ignore-daemonsets --force --disable-eviction
```

### 4. Longhorn Node Not Schedulable

**Symptoms:**
- New volumes won't schedule on a node
- Longhorn UI shows node as "unschedulable"

**Solution:**

```bash
# Check Longhorn node status
kubectl get nodes.longhorn.io -n longhorn-system

# Enable scheduling
kubectl patch nodes.longhorn.io <node-name> -n longhorn-system \
  --type=merge -p '{"spec":{"allowScheduling":true}}'
```

## Recommended Settings for 3-Node HA Cluster

### Longhorn Settings

```bash
# Apply optimal settings for HA
kubectl patch settings.longhorn.io default-replica-count -n longhorn-system \
  --type=merge -p '{"value":"2"}'

kubectl patch settings.longhorn.io node-drain-policy -n longhorn-system \
  --type=merge -p '{"value":"block-if-contains-last-replica"}'

kubectl patch settings.longhorn.io node-down-pod-deletion-policy -n longhorn-system \
  --type=merge -p '{"value":"delete-both-statefulset-and-deployment-pod"}'

kubectl patch settings.longhorn.io replica-auto-balance -n longhorn-system \
  --type=merge -p '{"value":"best-effort"}'
```

### Helm Values (values.yaml)

```yaml
defaultSettings:
  defaultReplicaCount: "2"
  nodeDrainPolicy: "block-if-contains-last-replica"
  nodeDownPodDeletionPolicy: "delete-both-statefulset-and-deployment-pod"
  replicaAutoBalance: "best-effort"
  replicaSoftAntiAffinity: "false"  # Hard anti-affinity
```

## Monitoring

### Check Volume Health

```bash
# All volumes status
kubectl get volumes.longhorn.io -n longhorn-system \
  -o custom-columns='NAME:.metadata.name,STATE:.status.state,ROBUSTNESS:.status.robustness'

# Check for degraded volumes
kubectl get volumes.longhorn.io -n longhorn-system \
  -o json | jq -r '.items[] | select(.status.robustness != "healthy") | .metadata.name'
```

### Check Node Status

```bash
kubectl get nodes.longhorn.io -n longhorn-system \
  -o custom-columns='NAME:.metadata.name,READY:.status.conditions[0].status,SCHEDULABLE:.spec.allowScheduling'
```

### Longhorn UI

```bash
# Port forward to Longhorn UI
kubectl port-forward -n longhorn-system svc/longhorn-frontend 8080:80
# Visit http://localhost:8080
```

## Related Files

- **Helm Values:** `pi-fleet/clusters/eldertree/storage/longhorn/values.yaml`
- **HelmRelease:** `pi-fleet/clusters/eldertree/storage/longhorn/helmrelease.yaml`

## Related Runbooks

- [HA-001: Node Failure and HA Cluster Recovery](/runbook/issues/ha/HA-001)
- [VAULT-001: Vault Recovery Guide](/runbook/issues/storage/VAULT-001)
