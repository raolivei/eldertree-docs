import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ClusterGlance from "./components/ClusterGlance.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ClusterGlance", ClusterGlance);
  },
} satisfies Theme;
