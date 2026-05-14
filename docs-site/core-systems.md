# Core Systems

> Freqtrade 核心子系统详解

## 1. Exchange Layer

### Overview

```python
class Exchange:
    """交易所抽象层"""

    def __init__(self, config: dict):
        self.config = config
        self.markets = {}
        self._api = None

    async def load_markets(self):
        """加载市场数据"""
        pass

    def get_ticker(self, pair: str) -> dict:
        """获取当前价格"""
        pass

    def get_ohlcv(self, pair: str, timeframe: str, since: int) -> list:
        """获取K线数据"""
        pass

    async def create_order(self, side: str, pair: str, amount: float, rate: float = None):
        """创建订单"""
        pass
```

### 支持的交易所

| 交易所 | 状态 | 备注 |
|--------|------|------|
| Binance | ✅ 支持 | Spot / Futures / Margin |
| Binanceus | ✅ 支持 | |
| FTX | ✅ 支持 | (已停止运营) |
| Kraken | ✅ 支持 | |
| Coinbase | ✅ 支持 | |
| Bitrue | ✅ 支持 | |
| Gate.io | ✅ 支持 | |
| Okex | ✅ 支持 | |
| Bybit | ✅ 支持 | |

## 2. Trading Engine

### Position Management

```python
class Position:
    """仓位管理"""

    def __init__(self, pair: str, stake_amount: float):
        self.pair = pair
        self.stake_amount = stake_amount
        self.open_trade_price = 0.0
        self.current_profit = 0.0
        self.stop_loss = None
        self.take_profit = None

    def update(self, current_price: float):
        """更新仓位盈亏"""
        self.current_profit = (
            (current_price - self.open_trade_price) / self.open_trade_price
        ) * 100

    def should_sell(self) -> bool:
        """检查是否应该平仓"""
        if self.stop_loss and self.current_profit <= self.stop_loss:
            return True
        if self.take_profit and self.current_profit >= self.take_profit:
            return True
        return False
```

### Order Execution

```python
class Order:
    """订单模型"""

    ORDER_MARKET = "market"
    ORDER_LIMIT = "limit"
    ORDER_STOP_LOSS = "stop_loss"
    ORDER_TAKE_PROFIT = "take_profit"

    def __init__(self, pair: str, side: str, amount: float, order_type: str):
        self.pair = pair
        self.side = side  # buy / sell
        self.amount = amount
        self.order_type = order_type
        self.filled = 0.0
        self.status = "pending"

    async def execute(self, exchange: Exchange):
        """执行订单"""
        pass

    async def cancel(self, exchange: Exchange):
        """取消订单"""
        pass
```

## 3. Backtest Engine

### Architecture

```python
class Backtesting:
    """回测引擎"""

    def __init__(self, config: dict, strategy: IStrategy):
        self.config = config
        self.strategy = strategy
        self.results = []

    async def run(self, timerange: Timerange):
        """运行回测"""
        # 1. 加载历史数据
        data = await self._load_data(timerange)

        # 2. 逐蜡烛图执行策略
        for pair, dataframe in data.items():
            dataframe = self.strategy.populate_indicators(dataframe)
            dataframe = self.strategy.populate_buy_trend(dataframe)
            dataframe = self.strategy.populate_sell_trend(dataframe)

            # 3. 模拟交易
            self._simulate_trades(dataframe)

        # 4. 生成报告
        return self._generate_report()

    def _simulate_trades(self, dataframe: DataFrame):
        """模拟交易"""
        for signal in dataframe[dataframe['buy']]:
            # 开仓
            self._open_trade(signal)

        for signal in dataframe[dataframe['sell']]:
            # 平仓
            self._close_trade(signal)
```

### Performance Metrics

| 指标 | 描述 |
|------|------|
| Total Profit | 总盈亏 (USD) |
| Profit Factor | 盈利因子 (Gross Profit / Gross Loss) |
| Max Drawdown | 最大回撤 |
| Sharpe Ratio | 夏普比率 |
| Sortino Ratio | 索提诺比率 |
| Win Rate | 胜率 |
| Avg Duration | 平均持仓时长 |

## 4. FreqAI - Machine Learning Module

### Architecture

```python
class FreqaiRL:
    """强化学习策略模块"""

    def __init__(self, config: dict):
        self.config = config
        self.model = None
        self.train_data = []
        self.targets = []

    def train(self, data: pd.DataFrame):
        """训练模型"""
        # 1. 特征工程
        features = self._extract_features(data)

        # 2. 标签生成
        labels = self._generate_labels(data)

        # 3. 模型训练
        self.model = self._build_model(features, labels)

    def predict(self, data: pd.DataFrame) -> np.array:
        """预测信号"""
        features = self._extract_features(data)
        return self.model.predict(features)

    def _extract_features(self, data: pd.DataFrame) -> np.array:
        """特征提取"""
        return data[['rsi', 'macd', 'bb_lower', 'volume', ...]].values

    def _generate_labels(self, data: pd.DataFrame) -> np.array:
        """标签生成 (future profit)"""
        return data['future_profit'].values
```

### RL Training Loop

```python
class RLAgent:
    """强化学习代理"""

    def __init__(self, state_size: int, action_size: int):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=10000)
        self.gamma = 0.95
        self.epsilon = 1.0

    def act(self, state: np.array) -> int:
        """选择动作 (epsilon-greedy)"""
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        return np.argmax(self.model.predict(state))

    def remember(self, state, action, reward, next_state, done):
        """记忆样本"""
        self.memory.append((state, action, reward, next_state, done))

    def replay(self, batch_size: int = 32):
        """经验回放"""
        # 从记忆中采样
        minibatch = random.sample(self.memory, batch_size)

        for state, action, reward, next_state, done in minibatch:
            target = reward
            if not done:
                target = reward + self.gamma * np.argmax(self.model.predict(next_state))

            # 更新 Q 值
            target_f = self.model.predict(state)
            target_f[0][action] = target
            self.model.fit(state, target_f)
```

## 5. RPC System

### Commands

| Command | Description |
|---------|-------------|
| `/status` | 显示当前交易状态 |
| `/profit` | 显示盈亏统计 |
| `/balance` | 显示余额 |
| `/trades` | 显示交易历史 |
| `/performance` | 显示策略表现 |
| `/start` | 启动机器人 |
| `/stop` | 停止机器人 |
| `/reload` | 重载策略 |
| `/whitelist` | 显示交易对白名单 |
| `/blacklist` | 显示交易对黑名单 |

### Websocket API

```python
# Telegram RPC
/rpc trades
/rpc profit
/rpc balance
/rpc status

# Freqtrade REST API
GET /api/v1/show_config
GET /api/v1/balance
GET /api/v1/trades
GET /api/v1/profit
POST /api/v1/start
POST /api/v1/stop
POST /api/v1/reload
```