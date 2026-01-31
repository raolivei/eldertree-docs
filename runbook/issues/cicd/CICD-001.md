---
id: CICD-001
category: cicd
severity: medium
symptoms:
  - GitHub workflow fails
  - Reusable workflow not found
  - Docker build fails in CI
---

# CICD-001: Reusable Workflow Issues

## Overview

All repositories use centralized reusable workflows from `raolivei/github-workflows`. This runbook covers common issues.

## Symptoms

- Workflow fails with "could not find reusable workflow"
- Docker build fails with authentication error
- Workflow runs but images not pushed

## Error Messages

```
error: could not find reusable workflow 'raolivei/github-workflows/.github/workflows/docker-build.yml@main'
```

```
Error: buildx failed with: ERROR: failed to solve: failed to push
```

```
denied: permission denied
```

## Diagnosis

### 1. Check workflow reference

```bash
# In the failing repo, check the workflow file
cat .github/workflows/build-and-push.yml | grep "uses:"
```

Verify the reference format:
```yaml
uses: raolivei/github-workflows/.github/workflows/docker-build.yml@main
```

### 2. Check github-workflows repo

```bash
# Verify the workflow exists
gh api repos/raolivei/github-workflows/contents/.github/workflows/docker-build.yml
```

### 3. Check secrets

```bash
# List repository secrets (names only)
gh secret list -R raolivei/<repo-name>
```

Required secrets vary by workflow:
- `docker-build.yml`: Uses `GITHUB_TOKEN` (automatic) or `REGISTRY_TOKEN`
- `terraform-*.yml`: `TF_API_TOKEN`, cloud provider credentials
- `gitops-image-update.yml`: `GITHUB_TOKEN` with write permissions

## Resolution

### Workflow Not Found

1. Verify the branch/tag exists:
   ```bash
   cd ~/WORKSPACE/raolivei/github-workflows
   git fetch --all
   git branch -a
   git tag -l
   ```

2. If using a feature branch, ensure it's pushed:
   ```bash
   git push -u origin <branch-name>
   ```

3. If main is missing the workflow, check recent changes:
   ```bash
   git log --oneline -10
   ```

### Authentication Errors

1. For GHCR, ensure `REGISTRY_TOKEN` is passed:
   ```yaml
   secrets:
     REGISTRY_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

2. For cross-repo access, you may need a PAT with `packages:write` scope

### Permission Issues

1. Check repository settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is enabled
3. For private repos, the github-workflows repo must allow access

## Verification

```bash
# Trigger a workflow run
gh workflow run build-and-push.yml -R raolivei/<repo-name>

# Watch the run
gh run watch -R raolivei/<repo-name>
```

## Available Workflows

| Workflow | Purpose |
|----------|---------|
| `docker-build.yml` | Build & push arm64 Docker images |
| `docker-matrix.yml` | Build multiple services in parallel |
| `python-ci.yml` | Python linting and testing |
| `node-ci.yml` | Node.js linting and testing |
| `static-site-pages.yml` | Deploy to GitHub Pages |
| `terraform-pr.yml` | Terraform plan on PR |
| `terraform-apply.yml` | Terraform apply (manual) |
| `gitops-image-update.yml` | Update K8s manifests |

## Related Issues

- [GitHub Actions Documentation](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [github-workflows repo](https://github.com/raolivei/github-workflows)

## References

- Blog: [Chapter 18: The CI/CD Consolidation](https://blog.eldertree.xyz/chapters/18-reusable-workflows)
