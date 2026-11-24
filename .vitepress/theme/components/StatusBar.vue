<script setup lang="ts">
import { computed } from "vue";
import { useClusterNodeStatus } from "../composables/useClusterNodeStatus";

/**
 * One-line cluster status above the nav (layout-top slot, 32px tall).
 * Readiness is shown only when status data was fetched; the static manifest's
 * "tier" is a hardware note, not readiness, so it renders as "—".
 */
const { displayNodes, source, lastUpdated, checked } = useClusterNodeStatus();

const sourceLabel = computed(() => {
  if (!checked.value) return "checking…";
  if (source.value !== "live") return "no status data";
  return lastUpdated.value ? `status ${lastUpdated.value.slice(0, 10)}` : "status";
});

const nodes = computed(() =>
  displayNodes.value.map((n) => ({
    id: n.id,
    state: source.value === "live" ? (n.tier === "stable" ? "ready" : "not-ready") : "unknown",
  })),
);

const stateText = { ready: "Ready", "not-ready": "Not ready", unknown: "—" } as const;
</script>

<template>
  <div class="rb-status" role="status" aria-label="Eldertree cluster status">
    <div class="rb-status__inner">
      <span class="rb-status__name">eldertree</span>
      <span v-for="n in nodes" :key="n.id" class="rb-status__node" :class="`rb-status__node--${n.state}`">
        <span class="rb-status__dot" aria-hidden="true" />{{ n.id }}
        <span class="rb-status__state">{{ stateText[n.state as keyof typeof stateText] }}</span>
      </span>
      <span class="rb-status__spacer" />
      <span class="rb-status__source">{{ sourceLabel }}</span>
      <a class="rb-status__link" href="https://control.eldertree.xyz/" target="_blank" rel="noopener noreferrer">control center ↗</a>
    </div>
  </div>
</template>

<style scoped>
.rb-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--vp-z-index-nav) + 1);
  height: var(--vp-layout-top-height);
  border-bottom: 1px solid var(--rb-border-soft);
  background: var(--rb-surface);
  font-family: var(--rb-mono);
  font-size: 12px;
  color: var(--rb-text-3);
}

.rb-status__inner {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  white-space: nowrap;
}

.rb-status__name {
  color: var(--rb-text);
}

.rb-status__node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rb-status__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rb-text-3);
}

.rb-status__node--ready .rb-status__dot {
  background: var(--rb-ok);
}

.rb-status__node--not-ready .rb-status__dot {
  background: var(--rb-critical);
}

.rb-status__node--not-ready .rb-status__state {
  color: var(--rb-critical);
}

.rb-status__spacer {
  flex: 1;
}

.rb-status__link {
  color: var(--rb-accent);
  text-decoration: none;
}

.rb-status__link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .rb-status__inner {
    gap: 10px;
    padding: 0 16px;
  }

  .rb-status__state,
  .rb-status__link {
    display: none;
  }
}
</style>
