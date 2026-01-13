#!/bin/bash
# Batch migration script for pi-fleet troubleshooting docs
#
# This script migrates all identified troubleshooting files from pi-fleet/docs
# to the eldertree-docs runbook format.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting batch migration of pi-fleet troubleshooting docs..."
echo ""

# DNS category
$SCRIPT_DIR/migrate.sh DNS_TROUBLESHOOTING.md DNS-001 dns high
$SCRIPT_DIR/migrate.sh PIHOLE_DNS_TROUBLESHOOTING.md PIHOLE-001 dns high

# Cloudflare category
$SCRIPT_DIR/migrate.sh CLOUDFLARE_TUNNEL_TROUBLESHOOTING.md CF-001 cloudflare high

# Node category
$SCRIPT_DIR/migrate.sh NODE_TROUBLESHOOTING.md NODE-001 node high
$SCRIPT_DIR/migrate.sh NODE_1_RECURRING_ISSUES.md NODE-002 node medium
$SCRIPT_DIR/migrate.sh NODE_1_ROOT_CAUSE.md NODE-003 node medium
$SCRIPT_DIR/migrate.sh NODE_TROUBLESHOOTING_SUMMARY.md NODE-004 node medium

# Boot category
$SCRIPT_DIR/migrate.sh BOOT_FIX.md BOOT-001 boot high
$SCRIPT_DIR/migrate.sh BOOT_RELIABILITY_FIX.md BOOT-002 boot high
$SCRIPT_DIR/migrate.sh NVME_BOOT_TROUBLESHOOTING.md BOOT-003 boot high
$SCRIPT_DIR/migrate.sh FIX_INITRAMFS.md BOOT-004 boot medium

# Network category
$SCRIPT_DIR/migrate.sh RECOVER_NETWORK_CONNECTIVITY.md NET-001 network critical
$SCRIPT_DIR/migrate.sh RECOVER_NODE_1_NETWORK.md NET-002 network high
$SCRIPT_DIR/migrate.sh FIX_NODES_AFTER_NETPLAN.md NET-003 network high
$SCRIPT_DIR/migrate.sh PREVENT_NETWORK_ISSUES.md NET-004 network medium

# Storage/Vault category
$SCRIPT_DIR/migrate.sh VAULT_RECOVERY.md VAULT-001 storage critical

# SSH category
$SCRIPT_DIR/migrate.sh FIX_SSH_PERMISSION_DENIED.md SSH-001 ssh high
$SCRIPT_DIR/migrate.sh SSH_RECOVERY.md SSH-002 ssh high
$SCRIPT_DIR/migrate.sh RECOVER_LOCKED_ROOT.md SSH-003 ssh high

# Emergency/Recovery category
$SCRIPT_DIR/migrate.sh EMERGENCY_MODE_RECOVERY.md EMERG-001 boot critical
$SCRIPT_DIR/migrate.sh EMERGENCY_MODE_FIX_NO_KEYBOARD.md EMERG-002 boot critical
$SCRIPT_DIR/migrate.sh RECOVERY_FROM_SD_CARD.md EMERG-003 boot high
$SCRIPT_DIR/migrate.sh RECOVERY_SD_CARD.md EMERG-004 boot high

# K3s category
$SCRIPT_DIR/migrate.sh K3S_SERVICE_TROUBLESHOOTING.md K3S-001 node high

echo ""
echo "Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review each migrated file and add specific symptoms to the frontmatter"
echo "2. Add exact error messages to the 'Error Messages (Searchable)' section"
echo "3. Update the sidebar in .vitepress/sidebar.ts to include new issues"
echo "4. Run 'npm run dev' to preview the site"


