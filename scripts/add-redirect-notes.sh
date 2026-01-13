#!/bin/bash
# Add redirect notices to original pi-fleet docs that have been migrated
#
# This script adds a notice at the top of each migrated file pointing to the new location
# in the eldertree-docs runbook.

set -e

PI_FLEET_DOCS="/Users/roliveira/WORKSPACE/raolivei/pi-fleet/docs"
NOTICE_MARKER="<!-- MIGRATED TO RUNBOOK -->"

add_notice() {
    local file="$1"
    local issue_id="$2"
    local category="$3"
    local filepath="$PI_FLEET_DOCS/$file"
    
    if [[ ! -f "$filepath" ]]; then
        echo "Skipping (not found): $file"
        return
    fi
    
    # Check if notice already added
    if grep -q "$NOTICE_MARKER" "$filepath" 2>/dev/null; then
        echo "Skipping (already has notice): $file"
        return
    fi
    
    # Create the redirect notice
    local NOTICE="$NOTICE_MARKER
> **📚 This document has been migrated to the Eldertree Runbook**
>
> For the latest version, see: [${issue_id}](https://docs.eldertree.xyz/runbook/issues/${category}/${issue_id})
>
> The runbook provides searchable troubleshooting guides with improved formatting.

---

"
    
    # Prepend notice to file
    echo "Adding notice to: $file -> $issue_id"
    {
        echo "$NOTICE"
        cat "$filepath"
    } > "$filepath.tmp"
    mv "$filepath.tmp" "$filepath"
}

# DNS
add_notice "DNS_TROUBLESHOOTING.md" "DNS-001" "dns"
add_notice "PIHOLE_DNS_TROUBLESHOOTING.md" "PIHOLE-001" "dns"

# Cloudflare
add_notice "CLOUDFLARE_TUNNEL_TROUBLESHOOTING.md" "CF-001" "cloudflare"

# Node
add_notice "NODE_TROUBLESHOOTING.md" "NODE-001" "node"
add_notice "NODE_1_RECURRING_ISSUES.md" "NODE-002" "node"
add_notice "NODE_1_ROOT_CAUSE.md" "NODE-003" "node"
add_notice "NODE_TROUBLESHOOTING_SUMMARY.md" "NODE-004" "node"
add_notice "K3S_SERVICE_TROUBLESHOOTING.md" "K3S-001" "node"

# Boot
add_notice "BOOT_FIX.md" "BOOT-001" "boot"
add_notice "BOOT_RELIABILITY_FIX.md" "BOOT-002" "boot"
add_notice "NVME_BOOT_TROUBLESHOOTING.md" "BOOT-003" "boot"
add_notice "FIX_INITRAMFS.md" "BOOT-004" "boot"
add_notice "EMERGENCY_MODE_RECOVERY.md" "EMERG-001" "boot"
add_notice "EMERGENCY_MODE_FIX_NO_KEYBOARD.md" "EMERG-002" "boot"
add_notice "RECOVERY_FROM_SD_CARD.md" "EMERG-003" "boot"
add_notice "RECOVERY_SD_CARD.md" "EMERG-004" "boot"

# Network
add_notice "RECOVER_NETWORK_CONNECTIVITY.md" "NET-001" "network"
add_notice "RECOVER_NODE_1_NETWORK.md" "NET-002" "network"
add_notice "FIX_NODES_AFTER_NETPLAN.md" "NET-003" "network"
add_notice "PREVENT_NETWORK_ISSUES.md" "NET-004" "network"

# Storage
add_notice "VAULT_RECOVERY.md" "VAULT-001" "storage"

# SSH
add_notice "FIX_SSH_PERMISSION_DENIED.md" "SSH-001" "ssh"
add_notice "SSH_RECOVERY.md" "SSH-002" "ssh"
add_notice "RECOVER_LOCKED_ROOT.md" "SSH-003" "ssh"

echo ""
echo "Done! Redirect notices added to migrated files."
