import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";
import { existsSync } from "fs";
import { resolve } from "path";

// Determine base path:
// - If CNAME exists (custom domain), use root path /
// - If production without custom domain, use /eldertree-docs/
// - Otherwise (local dev), use /
const cnamePath = resolve(__dirname, "../public/CNAME");
const hasCustomDomain = existsSync(cnamePath);
const base = hasCustomDomain || process.env.NODE_ENV !== "production" ? "/" : "/eldertree-docs/";

export default defineConfig({
  base,
  title: "Eldertree Docs",
  description: "Documentation and incident runbook for the eldertree Kubernetes cluster",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Eldertree Docs" }],
    ["meta", { property: "og:title", content: "Eldertree Docs - Cluster Runbook" }],
    ["meta", { property: "og:description", content: "Documentation and incident runbook for the eldertree Kubernetes cluster" }],
  ],

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Runbook", link: "/runbook/" },
      { text: "Infrastructure", link: "https://github.com/raolivei/pi-fleet" },
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: "github", link: "https://github.com/raolivei/eldertree-docs" },
    ],

    editLink: {
      pattern: "https://github.com/raolivei/eldertree-docs/tree/main/:path",
      text: "Edit this page on GitHub",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Incident runbook for the eldertree Kubernetes cluster",
      copyright: "Copyright © 2026 Rafael Oliveira",
    },
  },

  markdown: {
    image: {
      lazyLoading: true,
    },
  },

  ignoreDeadLinks: true,

  srcExclude: [
    "**/README.md",
    "**/CHANGELOG.md",
  ],
});


