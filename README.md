# Freqtrade Develop Design

Design documentation site for [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade) — a cryptocurrency trading bot.

**GitHub Repository**: https://github.com/yeluo45/freqtrade-develop-design

## Project Structure

```
freqtrade-develop-design/
├── docs-site/                 # VitePress documentation site
│   ├── .vitepress/
│   │   ├── config.mjs         # VitePress configuration (green theme)
│   │   ├── theme/             # Custom theme
│   │   └── public/            # Static assets
│   ├── index.md               # Home page
│   ├── architecture.md         # Architecture overview
│   ├── core-systems.md         # Core systems (Exchange, Trading, Backtest, FreqAI)
│   ├── bot-commands.md        # Bot commands (Telegram/REST)
│   └── configuration.md       # Configuration reference
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
└── package.json
```

## Quick Start

```bash
cd docs-site
pnpm install
pnpm run dev      # Development preview
pnpm run build    # Production build
pnpm run preview  # Preview build
```

## Live Site

https://yeluo45.github.io/freqtrade-develop-design/

## Content

| Document | Description |
|----------|-------------|
| [Architecture](https://yeluo45.github.io/freqtrade-develop-design/architecture) | Complete architecture overview |
| [Core Systems](https://yeluo45.github.io/freqtrade-develop-design/core-systems) | Exchange, Trading, Backtest, FreqAI |
| [Bot Commands](https://yeluo45.github.io/freqtrade-develop-design/bot-commands) | Telegram and REST API commands |
| [Configuration](https://yeluo45.github.io/freqtrade-develop-design/configuration) | Configuration reference |

## Key Features

| Feature | Description |
|---------|-------------|
| Trading Modes | Spot, Futures, Margin, Hedge |
| Exchanges | 20+ exchanges supported |
| Strategy | Custom strategies with indicators |
| FreqAI | ML-based trading strategies |
| Backtest | High-performance backtesting engine |
| RPC | Telegram and REST API |

## License

Freqtrade is open source under the GPL-3.0 license.