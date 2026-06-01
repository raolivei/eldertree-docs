---
id: OPENCLAW-008
title: Accidental Deployment Delete / Helm Drift
category: openclaw
severity: high
symptoms:
  - No pods in openclaw namespace but HelmRelease Ready
  - kubectl get deploy -n openclaw empty
  - Services and ingress remain
  - Elder and OpenClaw missing after mistaken delete
---

# OPENCLAW-008: Accidental Deployment Delete / Helm Drift

## Symptoms

- `kubectl get deploy,pods -n openclaw` → **No resources found**.
- `kubectl get helmrelease openclaw -n openclaw` still shows **Ready** / `UpgradeSucceeded`.
- `helm status openclaw-openclaw -n openclaw` lists Services/Ingress but **no Deployments**.
- Telegram bot and Web UI down.

## Root Cause

Deployments were **`kubectl delete deployment ...`** outside Helm. Helm release state still thinks revision N is deployed; **Flux reconcile alone may not recreate** missing Deployments.

## Resolution

### Option A — Force Helm upgrade (fastest)

```bash
export KUBECONFIG=~/.kube/config-eldertree
cd /path/to/pi-fleet
KUBECONFIG=~/.kube/config-eldertree helm upgrade openclaw-openclaw ./helm/eldertree-app \
  -n openclaw --reuse-values
```

Wait for rollouts:

```bash
kubectl rollout status deployment/openclaw -n openclaw
kubectl rollout status deployment/elder -n openclaw
```

### Option B — Flux

```bash
flux reconcile helmrelease openclaw -n openclaw
```

If Deployments still missing, use Option A.

### Option C — Delete HelmRelease and re-apply (last resort)

Only if release is corrupted; may cause brief ingress disruption. Prefer A.

## Verification

```bash
kubectl get deploy,pods -n openclaw
kubectl logs -n openclaw deployment/openclaw --tail=20
```

Both `openclaw` and `elder` Deployments should be **1/1 Ready**.

## Prevention

- Prefer **`kubectl rollout restart deployment/openclaw -n openclaw`** over delete.
- Use GitOps (pi-fleet) as source of truth; avoid manual edits to Deployments.

## Related Files

- `pi-fleet/clusters/eldertree/openclaw/helmrelease.yaml`
- `pi-fleet/helm/eldertree-app/`
