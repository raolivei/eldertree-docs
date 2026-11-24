import type { Theme } from "vitepress";
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import ClusterGlance from "./components/ClusterGlance.vue";
import IssueCard from "./components/IssueCard.vue";
import RunbookHome from "./components/RunbookHome.vue";
import StatusBar from "./components/StatusBar.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-top": () => h(StatusBar),
      "doc-before": () => h(IssueCard),
    }),
  enhanceApp({ app }) {
    app.component("ClusterGlance", ClusterGlance);
    app.component("RunbookHome", RunbookHome);
  },
} satisfies Theme;
