<script setup lang="ts">
import { withBase } from "vitepress";
import { data } from "../runbook.data";

/** Opens VitePress local search (the nav's search button). */
function openSearch() {
  const button = document.querySelector<HTMLButtonElement>(".VPNavBarSearch button, .DocSearch-Button");
  button?.click();
}

const total = data.entries.length;
</script>

<template>
  <div class="rb-home">
    <section class="rb-hero">
      <p class="rb-hero__prompt">$ runbook --search "&lt;error or symptom&gt;"</p>
      <h1 class="rb-hero__title">Eldertree Runbook</h1>
      <p class="rb-hero__lede">
        Known failures on the Eldertree K3s cluster: the exact error text, the fix and the command that
        verifies it. The reasons behind them live in the <a href="https://blog.eldertree.xyz/">build diary</a>.
      </p>
      <div class="rb-hero__actions">
        <button type="button" class="rb-btn rb-btn--brand" @click="openSearch">Search {{ total }} entries <kbd>/</kbd></button>
        <a class="rb-btn" :href="withBase('/runbook/')">Browse by symptom</a>
        <a class="rb-btn" :href="withBase('/runbook/workflow')">Agent workflow</a>
      </div>
    </section>

    <section class="rb-section" aria-labelledby="rb-cats">
      <h2 id="rb-cats" class="rb-section__title">› categories</h2>
      <div class="rb-cats">
        <a v-for="c in data.categories" :key="c.name" class="rb-cat" :href="withBase('/runbook/')">
          <span class="rb-cat__name">{{ c.name }}</span>
          <span class="rb-cat__count">{{ c.count }}</span>
          <span class="rb-cat__sev">
            <span v-if="c.critical" class="rb-sev--critical">{{ c.critical }} critical</span>
            <span v-if="c.high" class="rb-sev--high">{{ c.high }} high</span>
            <span v-if="!c.critical && !c.high">medium only</span>
          </span>
        </a>
      </div>
    </section>

    <section class="rb-section" aria-labelledby="rb-index">
      <h2 id="rb-index" class="rb-section__title">› all entries · most severe first</h2>
      <div class="rb-index">
        <div class="rb-index__scroll">
          <div class="rb-index__head" aria-hidden="true"><span>ID</span><span>SEV</span><span>TITLE</span><span>CATEGORY</span></div>
          <ol class="rb-index__list">
            <li v-for="e in data.entries" :key="e.id">
              <a class="rb-index__row" :href="withBase(e.url)">
                <span class="rb-index__id">{{ e.id }}</span>
                <span class="rb-index__sev" :class="e.severity && `rb-sev--${e.severity}`">{{ e.severity ?? "—" }}</span>
                <span class="rb-index__title">{{ e.title }}</span>
                <span class="rb-index__cat">{{ e.category }}</span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rb-home {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 24px;
  color: var(--rb-text);
}

.rb-hero {
  padding: 64px 0 44px;
  border-bottom: 1px dashed var(--rb-border);
}

.rb-hero__prompt {
  margin: 0;
  font-family: var(--rb-mono);
  font-size: 14px;
  color: var(--rb-text-3);
}

.rb-hero__title {
  margin: 14px 0 0;
  font-family: var(--rb-mono);
  font-size: clamp(32px, 6vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.035em;
  font-weight: 700;
}

.rb-hero__lede {
  margin: 16px 0 0;
  max-width: 640px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--rb-text-2);
}

.rb-hero__lede a {
  color: var(--rb-accent);
  text-decoration: none;
}

.rb-hero__lede a:hover {
  text-decoration: underline;
}

.rb-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.rb-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--rb-border);
  border-radius: 6px;
  background: transparent;
  font-family: var(--rb-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--rb-text);
  text-decoration: none;
  cursor: pointer;
}

.rb-btn:hover {
  border-color: var(--rb-accent);
}

.rb-btn--brand {
  border-color: transparent;
  background: var(--rb-accent);
  color: var(--vp-button-brand-text);
  font-weight: 600;
}

.rb-btn--brand:hover {
  background: var(--rb-accent-strong);
}

.rb-btn kbd {
  padding: 1px 6px;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-family: inherit;
  font-size: 11px;
  opacity: 0.7;
}

.rb-section {
  padding-top: 44px;
}

.rb-section__title {
  margin: 0 0 14px;
  font-family: var(--rb-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--rb-text-3);
}

.rb-cats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 10px;
}

.rb-cat {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--rb-border);
  border-radius: 8px;
  background: var(--rb-surface);
  text-decoration: none;
  font-family: var(--rb-mono);
}

.rb-cat:hover {
  border-color: var(--rb-accent);
}

.rb-cat__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--rb-text);
}

.rb-cat__count {
  font-size: 14px;
  color: var(--rb-accent);
}

.rb-cat__sev {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--rb-text-3);
}

.rb-index {
  border: 1px solid var(--rb-border);
  border-radius: 8px;
  background: var(--rb-surface);
  overflow: hidden;
}

.rb-index__scroll {
  overflow-x: auto;
}

.rb-index__head,
.rb-index__row {
  display: grid;
  grid-template-columns: 132px 76px minmax(0, 1fr) 96px;
  gap: 12px;
  align-items: baseline;
  padding: 11px 16px;
  min-width: 600px;
}

.rb-index__head {
  border-bottom: 1px solid var(--rb-border);
  font-family: var(--rb-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--rb-text-3);
}

.rb-index__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rb-index__list li {
  border-bottom: 1px solid var(--rb-border-soft);
}

.rb-index__list li:last-child {
  border-bottom: 0;
}

.rb-index__row {
  color: var(--rb-text);
  text-decoration: none;
  font-size: 14px;
}

.rb-index__row:hover {
  background: var(--rb-surface-2);
}

.rb-index__row:hover .rb-index__title {
  color: var(--rb-accent);
}

.rb-index__id,
.rb-index__sev,
.rb-index__cat {
  font-family: var(--rb-mono);
  font-size: 12px;
  color: var(--rb-text-3);
}

.rb-index__id {
  color: var(--rb-text);
}

.rb-sev--critical { color: var(--rb-critical); }
.rb-sev--high { color: var(--rb-high); }
.rb-sev--medium { color: var(--rb-medium); }
</style>
