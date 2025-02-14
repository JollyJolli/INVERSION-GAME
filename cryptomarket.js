// Cryptocurrency market data
let cryptocurrencies = [
    { name: 'Bitcoin', symbol: 'BTC', price: 40000, priceHistory: [], icon: 'fab fa-bitcoin', volatility: 0.03 },
    { name: 'Ethereum', symbol: 'ETH', price: 2500, priceHistory: [], icon: 'fab fa-ethereum', volatility: 0.04 },    
    { name: 'Dogecoin', symbol: 'DOGE', price: 0.15, priceHistory: [], icon: 'fas fa-dog', volatility: 0.08 },
    { name: 'FormenCoin', symbol: '4MEN', price: 10000, priceHistory: [], icon: 'fas fa-coins', volatility: 6 },
    { name: 'Cardano', symbol: 'ADA', price: 0.50, priceHistory: [], icon: 'fas fa-atom', volatility: 0.05 },
    { name: 'Solana', symbol: 'SOL', price: 95.00, priceHistory: [], icon: 'fas fa-sun', volatility: 0.07 }
];

// Update cryptocurrency prices every 10 seconds
function updateCryptoPrices() {
    cryptocurrencies.forEach(crypto => {
        // Generate random price change based on volatility
        const maxChange = crypto.volatility * 100; // Convert volatility to percentage
        const changePercent = (Math.random() * (maxChange * 2) - maxChange) / 100;
        const oldPrice = crypto.price;
        crypto.price = crypto.price * (1 + changePercent);
        
        // Update price history (keep last 5 prices)
        crypto.priceHistory.push(crypto.price);
        if (crypto.priceHistory.length > 5) {
            crypto.priceHistory.shift();
        }
        
        updateCryptoUI(crypto, oldPrice);
    });
}

// Update the UI for a specific cryptocurrency
function formatNumber(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateCryptoUI(crypto, oldPrice) {
    const cryptoElement = document.querySelector(`[data-crypto="${crypto.symbol}"]`);
    if (!cryptoElement) return;

    const priceElement = cryptoElement.querySelector('.crypto-price');
    const chartElement = cryptoElement.querySelector('.crypto-chart');
    
    // Update portfolio if user owns this crypto
    if (userBalances[crypto.symbol] > 0) {
        updatePortfolioCard();
    }
    
    // Update price display with change indicator
    const priceChange = crypto.price - oldPrice;
    const changeClass = priceChange >= 0 ? 'price-up' : 'price-down';
    const changeIcon = priceChange >= 0 ? '↑' : '↓';
    
    priceElement.innerHTML = `
        $${formatNumber(crypto.price)}
        <span class="${changeClass}">${changeIcon} ${formatNumber(Math.abs(priceChange))}</span>
    `;
    
    // Update mini chart
    updatePriceChart(chartElement, crypto.priceHistory);
}

// Create and update price chart using canvas
function updatePriceChart(chartElement, priceHistory) {
    const canvas = chartElement.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw chart
    if (priceHistory.length > 1) {
        const max = Math.max(...priceHistory);
        const min = Math.min(...priceHistory);
        const range = max - min;
        
        ctx.beginPath();
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 2;
        
        priceHistory.forEach((price, index) => {
            const x = (index / (priceHistory.length - 1)) * width;
            const y = height - ((price - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
}

// User's cryptocurrency balances and portfolio card
let userBalances = {};
let portfolioCard = null;

// Initialize balances for each cryptocurrency
function initializeBalances() {
    cryptocurrencies.forEach(crypto => {
        userBalances[crypto.symbol] = 0;
    });
}

// Handle buying cryptocurrency
function handleBuyCrypto(crypto, amount) {
    if (amount <= 0) {
        alert('Please enter a valid amount to buy');
        return false;
    }
    
    const totalCost = crypto.price * amount;
    if (money < totalCost) {
        alert('Insufficient funds to make this purchase');
        return false;
    }
    
    money -= totalCost;
    userBalances[crypto.symbol] += amount;
    updateBalanceDisplay(crypto.symbol);
    updateDisplays();
    alert(`Successfully bought ${amount} ${crypto.symbol}`);
    return true;
}

// Handle selling cryptocurrency
function handleSellCrypto(crypto, amount) {
    if (amount <= 0) {
        alert('Please enter a valid amount to sell');
        return false;
    }
    
    if (userBalances[crypto.symbol] < amount) {
        alert(`Insufficient ${crypto.symbol} balance`);
        return false;
    }
    
    const totalValue = crypto.price * amount;
    money += totalValue;
    userBalances[crypto.symbol] -= amount;
    updateBalanceDisplay(crypto.symbol);
    updateDisplays();
    alert(`Successfully sold ${amount} ${crypto.symbol}`);
    return true;
}

// Update balance display for a specific cryptocurrency
function updateBalanceDisplay(symbol) {
    const cryptoElement = document.querySelector(`[data-crypto="${symbol}"]`);
    if (!cryptoElement) return;
    
    const balanceElement = cryptoElement.querySelector('.crypto-balance');
    balanceElement.textContent = `Balance: ${formatNumber(userBalances[symbol])} ${symbol}`;
}

// Create and update portfolio card
function updatePortfolioCard() {
    let hasHoldings = false;
    let portfolioHTML = '';
    
    cryptocurrencies.forEach(crypto => {
        if (userBalances[crypto.symbol] > 0) {
            hasHoldings = true;
            const totalValue = userBalances[crypto.symbol] * crypto.price;
            const valueChange = (crypto.price - crypto.priceHistory[0]) * userBalances[crypto.symbol];
            const changeClass = valueChange >= 0 ? 'price-up' : 'price-down';
            const changeIcon = valueChange >= 0 ? '↑' : '↓';
            
            portfolioHTML += `
                <div class="portfolio-item">
                    <span class="portfolio-symbol">${crypto.symbol}</span>
                    <span class="portfolio-amount">${formatNumber(userBalances[crypto.symbol])}</span>
                    <span class="portfolio-value ${changeClass}">
                        $${formatNumber(totalValue)} ${changeIcon}
                    </span>
                </div>
            `;
        }
    });
    
    if (!portfolioCard && hasHoldings) {
        portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        document.body.appendChild(portfolioCard);
    } else if (portfolioCard && !hasHoldings) {
        portfolioCard.remove();
        portfolioCard = null;
        return;
    }
    
    if (portfolioCard) {
        portfolioCard.innerHTML = `
            <h3>My Portfolio</h3>
            <div class="portfolio-list">
                ${portfolioHTML}
            </div>
        `;
    }
}

// Initialize cryptocurrency display
function initCryptoMarket() {
    const cryptoList = document.querySelector('.crypto-list');
    if (!cryptoList) return;
    
    cryptocurrencies.forEach(crypto => {
        const cryptoElement = document.createElement('div');
        cryptoElement.className = 'crypto-item';
        cryptoElement.dataset.crypto = crypto.symbol;
        
        cryptoElement.innerHTML = `
            <div class="crypto-icon">
                <i class="${crypto.icon}"></i>
            </div>
            <div class="crypto-info">
                <h3>${crypto.name} (${crypto.symbol})</h3>
                <div class="crypto-price">$${formatNumber(crypto.price)}</div>
                <div class="crypto-chart">
                    <canvas width="150" height="50"></canvas>
                </div>
                <div class="trading-controls">
                    <div class="amount-controls">
                        <input type="number" class="trading-amount" placeholder="Amount" min="0" step="0.01">
                        <button class="max-amount-btn">MAX</button>
                    </div>
                    <div class="trade-buttons">
                        <button class="buy-crypto-btn">Buy</button>
                        <button class="sell-crypto-btn">Sell</button>
                    </div>
                </div>
                <div class="crypto-balance">Balance: 0 ${crypto.symbol}</div>
            </div>
        `;
        
        cryptoList.appendChild(cryptoElement);
        
        // Add event listeners for buy/sell buttons
        const buyBtn = cryptoElement.querySelector('.buy-crypto-btn');
        const sellBtn = cryptoElement.querySelector('.sell-crypto-btn');
        const amountInput = cryptoElement.querySelector('.trading-amount');
        const maxBtn = cryptoElement.querySelector('.max-amount-btn');
        
        // Add MAX button functionality
        maxBtn.addEventListener('click', () => {
            const maxAmount = money / crypto.price;
            amountInput.value = Math.floor(maxAmount * 100) / 100;
        });
        
        buyBtn.addEventListener('click', () => {
            const amount = parseFloat(amountInput.value);
            if (handleBuyCrypto(crypto, amount)) {
                amountInput.value = '';
            }
        });
        
        sellBtn.addEventListener('click', () => {
            const amount = parseFloat(amountInput.value);
            if (handleSellCrypto(crypto, amount)) {
                amountInput.value = '';
            }
        });
    });
    
    // Initialize balances
    initializeBalances();
    
    // Start price updates
    setInterval(updateCryptoPrices, 10000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCryptoMarket);