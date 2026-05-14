# Architecture

> Freqtrade 核心架构：模块化、高性能、面向加密货币交易的 Python 机器人框架

## 1. Overview

| 指标 | 数值 |
|------|------|
| 语言 | Python 3.10+ |
| 架构 | 微服务 + 事件驱动 |
| 核心模块 | 14+ |
| 策略格式 | JSON / Python |
| 支持交易所 | 20+ |
| 回测引擎 | 自研 (pandas + numpy) |

## 2. 模块架构

```
freqtrade/
├── commands/           # CLI 命令入口
├── exchange/           # 交易所适配器 (Binance, Kraken, etc.)
├── freqtrade/         # 主模块
│   ├── optimize/      # 回测/优化引擎
│   ├── rpc/          # RPC API
│   ├── strategies/   # 策略基类
│   └── trading/      # 交易引擎
├── freqai/            # ML 策略模块
├── ft_client/         # Telegram 客户端
└── res/              # 资源文件
```

## 3. 核心数据流

```
┌─────────────────────────────────────────────────────────┐
│ Exchange API                                            │
│ (Binance / Kraken / FTX / ...)                         │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Exchange Layer                                          │
│ - Market data (tickers, klines, orderbook)             │
│ - Order execution                                       │
│ - Balance management                                    │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Trading Engine                                          │
│ - Position management                                    │
│ - Order handling                                        │
│ - Stake calculation                                     │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Strategy Layer                                          │
│ - buy_indicator()                                      │
│ - sell_indicator()                                      │
│ - populate_buy_trend() / populate_sell_trend()        │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ RPC / Telegram                                          │
│ - /status                                              │
│ - /profit                                              │
│ - /trade                                              │
└─────────────────────────────────────────────────────────┘
```

## 4. Strategy 生命周期

```python
class IStrategy:
    """策略基类"""

    def __init__(self, config: dict):
        self.config = config
        self._broker = None

    # 1. 数据准备 (called once at startup)
    def populate_indicators(self, dataframe: DataFrame) -> DataFrame:
        """填充技术指标"""
        return dataframe

    # 2. 买入信号 (called on each candle)
    def populate_buy_trend(self, dataframe: DataFrame) -> DataFrame:
        """生成买入信号"""
        dataframe['buy'] = dataframe['rsi'] < 30
        return dataframe

    # 3. 卖出信号
    def populate_sell_trend(self, dataframe: DataFrame) -> DataFrame:
        """生成卖出信号"""
        dataframe['sell'] = dataframe['rsi'] > 70
        return dataframe

    # 4. 仓位确认
    def check_buy_timeout(self, pair: str, trade: Trade, **kwargs) -> bool:
        return False

    def check_sell_timeout(self, pair: str, trade: Trade, **kwargs) -> bool:
        return False

    # 5. 自定义止损
    def custom_stoploss(self, pair: str, trade: Trade, **kwargs) -> float:
        return 0.0
```

## 5. 核心配置结构

```python
{
    "max_open_trades": 3,
    "stake_currency": "USDT",
    "stake_amount": "unlimited",
    "fiat_display_currency": "USD",
    "dry_run": True,  # 回测模式

    "exchange": {
        "name": "binance",
        "key": "your_api_key",
        "secret": "your_api_secret",
    },

    "pairlists": [
        {"method": "StaticPairList"},  # 静态交易对
        {"method": "VolumePairList"},   # 成交量排序
    ],

    "edge": {
        "enabled": True,
        "process_throttle_secs": 60,
        "calc_throttle_secs": 60,
        "strategies": [...],
    },

    "freqai": {
        "enabled": False,
        "train_period_days": 15,
        "lookup_days": 14,
        "live_retrain_hours": 24,
    },
}
```