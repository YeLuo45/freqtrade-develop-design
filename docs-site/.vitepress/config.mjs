import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Freqtrade Develop Design",
  description: "Freqtrade 加密货币交易机器人开发文档 — Cryptocurrency Trading Bot",

  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#00b894" }],
    ["meta", { name: "description", content: "Freqtrade develop documentation - Python crypto trading bot" }],
  ],

  base: "/freqtrade-develop-design/",

  themeConfig: {
    logo: "/favicon.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Architecture", link: "/architecture" },
      { text: "Core Systems", link: "/core-systems" },
      { text: "Bot Commands", link: "/bot-commands" },
    ],
    sidebar: [
      { text: "Introduction", items: [
        { text: "Overview", link: "/architecture" },
        { text: "Core Systems", link: "/core-systems" },
        { text: "Configuration", link: "/configuration" },
      ]},
      { text: "Trading", items: [
        { text: "Bot Commands", link: "/bot-commands" },
        { text: "Strategy", link: "/strategy" },
        { text: "Edge", link: "/edge" },
      ]},
      { text: "API & Integration", items: [
        { text: "RPC Commands", link: "/rpc-commands" },
        { text: "Webhooks", link: "/webhooks" },
        { text: "REST API", link: "/rest-api" },
      ]},
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/freqtrade/freqtrade" },
    ],
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
});