#!/bin/bash
# Migration script to convert pi-fleet troubleshooting docs to runbook format
#
# Usage: ./migrate.sh <source_file> <issue_id> <category> <severity>
# Example: ./migrate.sh DNS_TROUBLESHOOTING.md DNS-001 dns high

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
PI_FLEET_DOCS="/Users/roliveira/WORKSPACE/raolivei/pi-fleet/docs"

SOURCE_FILE="$1"
ISSUE_ID="$2"
CATEGORY="$3"
SEVERITY="${4:-medium}"

if [[ -z "$SOURCE_FILE" || -z "$ISSUE_ID" || -z "$CATEGORY" ]]; then
    echo "Usage: $0 <source_file> <issue_id> <category> [severity]"
    echo "Example: $0 DNS_TROUBLESHOOTING.md DNS-001 dns high"
    exit 1
fi

SOURCE_PATH="$PI_FLEET_DOCS/$SOURCE_FILE"
TARGET_DIR="$REPO_ROOT/runbook/issues/$CATEGORY"
TARGET_FILE="$TARGET_DIR/$ISSUE_ID.md"

if [[ ! -f "$SOURCE_PATH" ]]; then
    echo "Error: Source file not found: $SOURCE_PATH"
    exit 1
fi

mkdir -p "$TARGET_DIR"

# Extract title from first heading or filename
TITLE=$(grep -m1 "^# " "$SOURCE_PATH" | sed 's/^# //' || echo "$SOURCE_FILE" | sed 's/.md$//' | tr '_' ' ')

# Generate frontmatter and content
{
    echo "---"
    echo "id: $ISSUE_ID"
    echo "title: $TITLE"
    echo "category: $CATEGORY"
    echo "severity: $SEVERITY"
    echo "source: pi-fleet/docs/$SOURCE_FILE"
    echo "symptoms:"
    echo "  - See Error Messages section below"
    echo "---"
    echo ""
    echo "# $ISSUE_ID: $TITLE"
    echo ""
    echo "## Error Messages (Searchable)"
    echo ""
    echo "_Add exact error messages from this document here for searchability_"
    echo ""
    # Add original content (skip first heading if it exists)
    tail -n +2 "$SOURCE_PATH" | sed '/^$/d' | head -1 > /dev/null 2>&1
    # Check if first line is a heading, if so skip it
    FIRST_LINE=$(head -1 "$SOURCE_PATH")
    if [[ "$FIRST_LINE" =~ ^#\  ]]; then
        tail -n +2 "$SOURCE_PATH"
    else
        cat "$SOURCE_PATH"
    fi
} > "$TARGET_FILE"

echo "Migrated: $SOURCE_FILE -> $TARGET_FILE"
echo "Note: Edit the file to add specific symptoms and error messages to the frontmatter"

