// Game state
let money = 0;
let moneyPerSecond = 0;
let prestigePoints = 0;
let prestigeMultiplier = 1;
let achievements = {
    moneyEarned: { name: "Money Maker", thresholds: [1000, 10000, 100000], earned: [] },
    prestigeTimes: { name: "Prestige Master", thresholds: [1, 5, 10], earned: [] }
};
let lastUpdate = Date.now();
let stats = {
    totalMoneyEarned: 0,
    totalClicks: 0,
    prestigeTimes: 0
};
let upgrades = {};

// Load investment configurations
async function loadInvestments() {
    try {
        const response = await fetch('investments.json');
        const data = await response.json();
        
        // Initialize upgrades from JSON data
        Object.keys(data.investments).forEach(key => {
            upgrades[key] = {
                owned: 0,
                cost: data.investments[key].baseCost,
                baseCost: data.investments[key].baseCost,
                income: data.investments[key].income,
                unlocked: data.investments[key].unlockCondition === 0, // Unlock if condition is 0
                unlockCondition: data.investments[key].unlockCondition,
                name: data.investments[key].name,
                description: data.investments[key].description,
                costMultiplier: data.investments[key].costMultiplier,
                icon: data.investments[key].icon
            };
        });
        
        // Update UI with loaded investments
        updateUpgradesUI();
    } catch (error) {
        console.error('Error loading investments:', error);
    }
}

// Format money function
function formatMoney(amount) {
    return '$' + amount.toFixed(2);
}

// Update displays
function updateDisplays() {
    const moneyDisplay = document.getElementById('money');
    const perSecondDisplay = document.getElementById('per-second');
    const prestigePointsDisplay = document.getElementById('prestige-points');
    const prestigeMultiplierDisplay = document.getElementById('prestige-multiplier');
    
    moneyDisplay.textContent = formatMoney(money);
    perSecondDisplay.textContent = `(${formatMoney(moneyPerSecond)}/sec)`;
    
    if (prestigePointsDisplay) {
        prestigePointsDisplay.textContent = prestigePoints;
        prestigeMultiplierDisplay.textContent = prestigeMultiplier.toFixed(1) + 'x';
    }
}

// Update upgrades UI
function updateUpgradesUI() {
    const upgradesList = document.querySelector('.upgrades-list');
    upgradesList.innerHTML = '';
    
    Object.keys(upgrades).forEach(key => {
        const upgrade = upgrades[key];
        if (upgrade.unlocked) {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            upgradeElement.dataset.id = key;
            upgradeElement.innerHTML = `
                <h3>${upgrade.name} ${upgrade.icon}</h3>
                <p>Cost: ${formatMoney(upgrade.cost)}</p>
                <p>${upgrade.description}</p>
                <button class="buy-btn">Buy</button>
                <span class="owned">Owned: ${upgrade.owned}</span>
            `;
            upgradesList.appendChild(upgradeElement);
        }
    });
    
    // Reattach buy button handlers
    attachBuyButtonHandlers();
}

// Buy upgrade handler
function attachBuyButtonHandlers() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const upgradeItem = button.closest('.upgrade-item');
            const upgradeId = upgradeItem.dataset.id;
            const upgrade = upgrades[upgradeId];

            if (money >= upgrade.cost) {
                money -= upgrade.cost;
                upgrade.owned++;
                upgrade.cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
                moneyPerSecond += upgrade.income;

                // Update only the specific upgrade element
                upgradeItem.querySelector('p:first-of-type').textContent = `Cost: ${formatMoney(upgrade.cost)}`;
                upgradeItem.querySelector('.owned').textContent = `Owned: ${upgrade.owned}`;
                updateDisplays();
                checkAchievements();

                // Check for new unlocks and only add them if they're not already displayed
                Object.keys(upgrades).forEach(key => {
                    const shouldBeUnlocked = upgrades[key].unlockCondition <= money;
                    if (shouldBeUnlocked && !upgrades[key].unlocked) {
                        upgrades[key].unlocked = true;
                        const newUpgrade = upgrades[key];
                        const upgradesList = document.querySelector('.upgrades-list');
                        
                        const newUpgradeElement = document.createElement('div');
                        newUpgradeElement.className = 'upgrade-item';
                        newUpgradeElement.dataset.id = key;
                        newUpgradeElement.innerHTML = `
                            <h3>${newUpgrade.name} ${newUpgrade.icon}</h3>
                            <p>Cost: ${formatMoney(newUpgrade.cost)}</p>
                            <p>${newUpgrade.description}</p>
                            <button class="buy-btn">Buy</button>
                            <span class="owned">Owned: ${newUpgrade.owned}</span>
                        `;
                        upgradesList.appendChild(newUpgradeElement);
                        // Attach handler to the new button
                        attachBuyButtonHandlers();
                    }
                });
            } else {
                button.style.backgroundColor = '#dc3545';
                setTimeout(() => button.style.backgroundColor = '', 300);
            }
        });
    });
}

// Show achievement notification
function showAchievementNotification(achievementName) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <i class="fas fa-trophy"></i>
        <div>Achievement Unlocked!<br>${achievementName}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Update achievements page
function updateAchievementsPage() {
    const achievementsList = document.querySelector('.achievements-list');
    if (!achievementsList) return;

    achievementsList.innerHTML = '';
    
    Object.entries(achievements).forEach(([key, achievement]) => {
        const thresholds = achievement.thresholds;
        const earned = achievement.earned;
        const nextThreshold = thresholds[earned.length] || thresholds[thresholds.length - 1];
        const progress = key === 'moneyEarned' ? stats.totalMoneyEarned : stats.prestigeTimes;
        const percentage = Math.min(100, (progress / nextThreshold) * 100);

        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${earned.length === thresholds.length ? 'completed' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-icon">
                <i class="${key === 'moneyEarned' ? 'fas fa-dollar-sign' : 'fas fa-star'}"></i>
            </div>
            <div class="achievement-info">
                <h3>${achievement.name}</h3>
                <div class="achievement-progress">
                    Progress: ${earned.length}/${thresholds.length}<br>
                    Next: ${formatMoney(nextThreshold)}
                    (${percentage.toFixed(1)}%)
                </div>
            </div>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

// Check achievements
function checkAchievements() {
    if (stats.totalMoneyEarned >= achievements.moneyEarned.thresholds[achievements.moneyEarned.earned.length]) {
        achievements.moneyEarned.earned.push(stats.totalMoneyEarned);
        showAchievementNotification(achievements.moneyEarned.name);
    }
    if (stats.prestigeTimes >= achievements.prestigeTimes.thresholds[achievements.prestigeTimes.earned.length]) {
        achievements.prestigeTimes.earned.push(stats.prestigeTimes);
        showAchievementNotification(achievements.prestigeTimes.name);
    }
    updateAchievementsPage();
}

// Prestige function
function prestige() {
    if (money >= 1000000) {
        const newPoints = Math.floor(Math.sqrt(money / 1000000));
        prestigePoints += newPoints;
        prestigeMultiplier = 1 + (prestigePoints * 0.1);
        stats.prestigeTimes++;
        
        // Reset game state
        money = 0;
        moneyPerSecond = 0;
        Object.keys(upgrades).forEach(key => {
            upgrades[key].owned = 0;
            upgrades[key].cost = upgrades[key].baseCost;
        });
        
        updateDisplays();
        checkAchievements();
        saveGame();
        alert(`Prestiged! Earned ${newPoints} prestige points!`);
    } else {
        alert('Need $1,000,000 to prestige!');
    }
}

// Save and load functions
function saveGame() {
    const gameState = {
        money,
        moneyPerSecond,
        prestigePoints,
        prestigeMultiplier,
        achievements,
        stats,
        upgrades,
        cryptocurrencies,
        userBalances
    };
    localStorage.setItem('investmentGame', JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem('investmentGame');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        money = gameState.money;
        moneyPerSecond = gameState.moneyPerSecond;
        prestigePoints = gameState.prestigePoints;
        prestigeMultiplier = gameState.prestigeMultiplier;
        achievements = gameState.achievements;
        stats = gameState.stats;
        upgrades = gameState.upgrades;
        
        // Load cryptocurrency data if it exists
        if (gameState.cryptocurrencies) {
            cryptocurrencies = gameState.cryptocurrencies;
        }
        if (gameState.userBalances) {
            userBalances = gameState.userBalances;
        }
        
        updateDisplays();
        updateAchievementsPage();
    }
}
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize game
    loadGame();
    await loadInvestments();

    // DOM elements
    const investBtn = document.getElementById('invest-btn');

    // Click handler
    investBtn.addEventListener('click', () => {
        const clickAmount = 1 * prestigeMultiplier;
        money += clickAmount;
        stats.totalMoneyEarned += clickAmount;
        stats.totalClicks++;
        investBtn.style.transform = 'scale(0.95)';
        setTimeout(() => investBtn.style.transform = 'scale(1)', 100);
        updateDisplays();
        checkAchievements();
    });

    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);

    // Passive income with delta time
    function updateGame() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastUpdate) / 1000;
        lastUpdate = currentTime;
        
        const income = moneyPerSecond * prestigeMultiplier * deltaTime;
        money += income;
        stats.totalMoneyEarned += income;
        updateDisplays();
        checkAchievements();
        
        requestAnimationFrame(updateGame);
    }
    requestAnimationFrame(updateGame);
});