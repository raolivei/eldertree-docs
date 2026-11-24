import { createContentLoader } from "vitepress";

/**
 * Build-time index of runbook entries from their frontmatter (id, title, category,
 * severity, symptoms). Feeds the home page's category tiles and entry index, so
 * neither is a hand-kept list.
 */

export type Severity = "critical" | "high" | "medium" | "low";

export interface RunbookEntry {
  id: string;
  title: string;
  category: string;
  severity?: Severity;
  url: string;
  symptoms: number;
}

export interface RunbookData {
  entries: RunbookEntry[];
  categories: { name: string; count: number; critical: number; high: number }[];
}

declare const data: RunbookData;
export { data };

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default createContentLoader("runbook/issues/**/*.md", {
  transform(raw): RunbookData {
    const entries: RunbookEntry[] = raw
      .filter((page) => typeof page.frontmatter?.id === "string")
      .map((page) => {
        const fm = page.frontmatter;
        return {
          id: fm.id,
          title: typeof fm.title === "string" ? fm.title : fm.id,
          category: typeof fm.category === "string" ? fm.category : "other",
          severity: fm.severity,
          url: page.url,
          symptoms: Array.isArray(fm.symptoms) ? fm.symptoms.length : 0,
        };
      })
      .sort(
        (a, b) =>
          (SEVERITY_ORDER[a.severity ?? "low"] ?? 9) - (SEVERITY_ORDER[b.severity ?? "low"] ?? 9) ||
          a.id.localeCompare(b.id, undefined, { numeric: true }),
      );

    const byCategory = new Map<string, RunbookData["categories"][number]>();
    for (const e of entries) {
      const c = byCategory.get(e.category) ?? { name: e.category, count: 0, critical: 0, high: 0 };
      c.count += 1;
      if (e.severity === "critical") c.critical += 1;
      if (e.severity === "high") c.high += 1;
      byCategory.set(e.category, c);
    }
    const categories = [...byCategory.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { entries, categories };
  },
});
