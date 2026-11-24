<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

/**
 * Triage card above a runbook entry (doc-before slot), built from the frontmatter
 * every entry already has. Renders nothing on pages without an `id`.
 */
const { frontmatter } = useData();

const card = computed(() => {
  const fm = frontmatter.value;
  if (typeof fm.id !== "string") return undefined;
  return {
    id: fm.id as string,
    severity: typeof fm.severity === "string" ? (fm.severity as string) : undefined,
    category: typeof fm.category === "string" ? (fm.category as string) : undefined,
    source: typeof fm.source === "string" ? (fm.source as string) : undefined,
    symptoms: Array.isArray(fm.symptoms) ? (fm.symptoms as string[]).filter((s) => typeof s === "string") : [],
  };
});
</script>

<template>
  <section v-if="card" class="rb-card" :aria-label="`${card.id} triage card`">
    <div class="rb-card__head">
      <span class="rb-card__id">{{ card.id }}</span>
      <span v-if="card.severity" class="rb-card__sev" :class="`rb-sev--${card.severity}`">{{ card.severity }}</span>
      <a v-if="card.category" class="rb-card__cat" :href="withBase('/runbook/')">{{ card.category }}</a>
      <span class="rb-card__spacer" />
      <span v-if="card.source" class="rb-card__source" :title="card.source">src: {{ card.source }}</span>
    </div>
    <div v-if="card.symptoms.length" class="rb-card__body">
      <p class="rb-card__label">Matches if you see</p>
      <ul class="rb-card__symptoms">
        <li v-for="s in card.symptoms" :key="s"><code>{{ s }}</code></li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.rb-card {
  margin: 0 0 28px;
  border: 1px solid var(--rb-border);
  border-radius: 10px;
  background: var(--rb-surface);
  font-family: var(--rb-mono);
  overflow: hidden;
}

.rb-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--rb-border-soft);
  font-size: 12px;
}

.rb-card__id {
  font-weight: 700;
  color: var(--rb-text);
}

.rb-card__sev,
.rb-card__cat {
  padding: 2px 8px;
  border: 1px solid var(--rb-border);
  border-radius: 4px;
  color: var(--rb-text-3);
  text-decoration: none;
}

.rb-card__cat:hover {
  color: var(--rb-accent);
  border-color: var(--rb-accent);
}

.rb-sev--critical { color: var(--rb-critical); border-color: color-mix(in srgb, var(--rb-critical) 45%, transparent); }
.rb-sev--high { color: var(--rb-high); border-color: color-mix(in srgb, var(--rb-high) 45%, transparent); }
.rb-sev--medium { color: var(--rb-medium); border-color: color-mix(in srgb, var(--rb-medium) 45%, transparent); }

.rb-card__spacer {
  flex: 1;
}

.rb-card__source {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--rb-text-3);
}

.rb-card__body {
  padding: 12px 14px 14px;
}

.rb-card__label {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rb-accent);
}

.rb-card__symptoms {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rb-card__symptoms li {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--rb-text-2);
}

.rb-card__symptoms li::before {
  content: "› ";
  color: var(--rb-text-3);
}

.rb-card__symptoms code {
  font-family: var(--rb-mono);
  font-size: 13px;
  padding: 0;
  background: none;
  color: var(--rb-text-2);
  white-space: normal;
  word-break: break-word;
}
</style>
