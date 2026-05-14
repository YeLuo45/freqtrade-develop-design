# Configuration

> Freqtrade 配置文件详解

## 1. Configuration Structure

```python
{
    "max_open_trades": 3,           # 最大同时交易对数
    "stake_currency": "USDT",        # 计价货币
    "stake_amount": "unlimited",     # 每次交易金额
    "fiat_display_currency": "USD",   # 法币显示

    "dry_run": True,                 # 模拟交易模式

    "unfilledtimeout": {             # 未成交订单超时
        "entry": 10,
        "exit": 10,
        "exit_timeout_count": 3,
    },

    "entry_pricing": {               # 买入定价
        "price_side": "same",
        "use_order_book": True,
        "order_book_top": 1,
        "price_last_balance": 0.0,
    },

    "exit_pricing": {                # 卖出定价
        "price_side": "same",
        "use_order_book": True,
        "order_book_top": 1,
    },

    "exchange": {                    # 交易所配置
        "name": "binance",
        "key": "your_key",
        "secret": "your_secret",
        "ccxt_config": {},
        "ccxt_async_config": {},
    },
}
```

## 2. Pairlists

### StaticPairList

```python
"pairlists": [
    {
        "method": "StaticPairList",
        "config": {
            "whitelist": [
                "ETH/USDT",
                "BTC/USDT",
                "BNB/USDT",
            ]
        }
    }
]
```

### VolumePairList

```python
"pairlists": [
    {
        "method": "VolumePairList",
        "config": {
            "number_assets": 20,
            "sort_key": "quoteVolume",
        }
    }
]
```

### PriceFilter

```python
"pairlists": [
    {
        "method": "StaticPairList",
    },
    {
        "method": "PriceFilter",
        "config": {
            "low_price_percent": 0.02,
            "enabled": True,
        }
    }
]
```

## 3. Edge Configuration

```python
"edge": {
    "enabled": True,
    "process_throttle_secs": 60,
    "calc_throttle_secs": 60,
    "strategies": [
        {
            "name": "SampleStrategy",
            "min_trade_duration": 60,       # 最小交易时长 (分钟)
            "max_trade_duration": 1440,      # 最大交易时长 (分钟)
            "stoploss_range": [-0.01, -0.1],  # 止损范围
            "allow_infra": True,             # 允许日内交易
        }
    ]
}
```

## 4. Bot Modes

### Spot Mode

```python
{
    "trading_mode": "spot",
    "margin_mode": "",
}
```

### Futures Mode

```python
{
    "trading_mode": "futures",
    "margin_mode": "isolated",  # isolated / cross
    "leverage": 5.0,
}
```

### Hedge Mode

```python
{
    "trading_mode": "futures",
    "margin_mode": "isolated",
    "dry_run": False,
    "enter_side_order_type": {
        "limit": {"price_min": 0.99, "price_max": 1.01}
    },
}
```

## 5. Data Format

### Timeframes

| Timeframe | Description |
|-----------|-------------|
| 1m | 1 分钟 |
| 5m | 5 分钟 |
| 15m | 15 分钟 |
| 1h | 1 小时 |
| 4h | 4 小时 |
| 1d | 1 天 |

### OHLCV Data

```python
{
    "timestamp": 1699999999,
    "open": 2000.0,
    "high": 2010.0,
    "low": 1990.0,
    "close": 2005.0,
    "volume": 1000.0,
}
```