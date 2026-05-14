# Bot Commands

> Freqtrade Telegram 和 RPC 命令详解

## 1. Telegram Commands

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | 启动机器人 | `/start` |
| `/stop` | 停止机器人 | `/stop` |
| `/status` | 显示交易状态 | `/status` |
| `/trades` | 显示交易历史 | `/trades` |
| `/profit` | 显示盈亏统计 | `/profit` |
| `/balance` | 显示账户余额 | `/balance` |
| `/daily` | 显示每日统计 | `/daily 7` |
| `/weekly` | 显示每周统计 | `/weekly 4` |

### Trading Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/forcesell` | 强制平仓 | `/forcesell ETH/USDT` |
| `/forcebuy` | 强制买入 | `/forcebuy ETH/USDT` |
| `/trades` | 交易历史 | `/trades` |
| `/edge` | Edge 统计 | `/edge` |

### Configuration Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/reload` | 重载策略 | `/reload` |
| `/whitelist` | 白名单 | `/whitelist` |
| `/blacklist` | 黑名单 | `/blacklist add ETH/USDT` |
| `/logs` | 日志 | `/logs 100` |
| `/stats` | 统计 | `/stats` |

## 2. REST API

### Endpoints

#### Balance

```bash
curl -X GET http://localhost:8080/api/v1/balance
```

Response:
```json
{
  "currencies": [
    {"currency": "USDT", "free": 1000.0, "total": 1000.0}
  ],
  "total": 1000.0
}
```

#### Trades

```bash
curl -X GET http://localhost:8080/api/v1/trades?limit=50
```

#### Place Order

```bash
curl -X POST http://localhost:8080/api/v1/trade
-H "Content-Type: application/json"
-d '{"pair": "ETH/USDT", "side": "buy", "amount": 0.1}'
```

## 3. Webhook Integration

### Trade Notifications

```yaml
webhook:
  enabled: true
  url: "https://your-webhook.com/trade"
  format: "json"
```

### Trade Payload

```json
{
  "action": "buy",
  "pair": "ETH/USDT",
  "price": 2000.0,
  "amount": 0.1,
  "stake_amount": 200.0,
  "profit": 5.5,
  "profit_percent": 2.75,
  "timestamp": 1699999999
}
```

## 4. Interactive Mode

### Telegram

```
/status trade
    └─ Trade: ETH/USDT
       └─ Amount: 0.1 ETH
       └─ Profit: +5.5 USD (+2.75%)
       └─ ROI: 2.75%
       └─ Open since: 2023-10-01 12:00

/profit
    └─ Total Profit: +150.5 USD
    └─ Profit Factor: 1.25
    └─ Win Rate: 55%
    └─ Avg Duration: 45m
```

### Telegram Bot Setup

```bash
# docker-compose.yml
environment:
  - TELEGRAM_ENABLED=true
  - TELEGRAM_TOKEN=your_bot_token
  - TELEGRAM_CHAT_ID=your_chat_id
```

## 5. Automation

### Scheduled Tasks

```python
# freqtrade/scripts/reschedule.py
from freqtrade.configuration import load_config
from freqtrade.rpc import RPC

def reschedule_trades():
    config = load_config("config.json")
    rpc = RPC(config)

    # 自动平衡
    rpc.rpc("balance", {})
```

### Auto Rebalance

```bash
# 自动再平衡脚本
python scripts/reschedule.py --strategy Rebalance
```