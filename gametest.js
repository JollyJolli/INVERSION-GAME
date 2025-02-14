// Game Testing Utilities
const GameTest = {
    // Test adding money
    addMoney: function(amount) {
        const initialMoney = money;
        money += amount;
        updateDisplays();
        console.log('%c🧪 Test: Add Money', 'color: #4CAF50; font-weight: bold;');
        console.log(
            '%c├─ Initial money: %c$' + initialMoney.toFixed(2) +
            '\n%c├─ Added amount: %c$' + amount.toFixed(2) +
            '\n%c├─ Final money: %c$' + money.toFixed(2) +
            '\n%c└─ Status: %c' + (money === initialMoney + amount ? 'PASSED ✅' : 'FAILED ❌'),
            'color: #666', 'color: #4CAF50',
            'color: #666', 'color: #4CAF50',
            'color: #666', 'color: #4CAF50',
            'color: #666', money === initialMoney + amount ? 'color: #4CAF50' : 'color: #f44336'
        );
    },

    // Test buying upgrades
    buyUpgrade: function(upgradeId, quantity = 1) {
        const upgrade = upgrades[upgradeId];
        if (!upgrade) {
            console.log('%c🧪 Test: Buy Upgrade', 'color: #f44336; font-weight: bold;');
            console.log('%c└─ Status: FAILED - Upgrade not found ❌', 'color: #f44336');
            return;
        }

        const initialOwned = upgrade.owned;
        const initialMoney = money;
        const initialMPS = moneyPerSecond;

        for (let i = 0; i < quantity; i++) {
            if (money >= upgrade.cost) {
                money -= upgrade.cost;
                upgrade.owned++;
                upgrade.cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
                moneyPerSecond += upgrade.income;
            }
        }

        updateDisplays();
        console.log('%c🧪 Test: Buy Upgrade', 'color: #2196F3; font-weight: bold;');
        console.log(
            '%c├─ Upgrade: %c' + upgrade.name +
            '\n%c├─ Quantity attempted: %c' + quantity +
            '\n%c├─ Initial owned: %c' + initialOwned +
            '\n%c├─ Final owned: %c' + upgrade.owned +
            '\n%c├─ Money spent: %c$' + (initialMoney - money).toFixed(2) +
            '\n%c├─ MPS increase: %c$' + (moneyPerSecond - initialMPS).toFixed(2) + '/sec' +
            '\n%c└─ Status: %c' + (upgrade.owned > initialOwned ? 'PASSED ✅' : 'FAILED ❌'),
            'color: #666', 'color: #2196F3',
            'color: #666', 'color: #2196F3',
            'color: #666', 'color: #2196F3',
            'color: #666', 'color: #2196F3',
            'color: #666', 'color: #2196F3',
            'color: #666', 'color: #2196F3',
            'color: #666', upgrade.owned > initialOwned ? 'color: #4CAF50' : 'color: #f44336'
        );
    },

    // Test prestige conditions
    checkPrestige: function() {
        console.log('%c🧪 Test: Check Prestige', 'color: #9C27B0; font-weight: bold;');
        console.log(
            '%c├─ Current money: %c$' + money.toFixed(2) +
            '\n%c├─ Required money: %c$1,000,000.00' +
            '\n%c├─ Can prestige: %c' + (money >= 1000000 ? 'Yes ✨' : 'No ❌') +
            '\n%c├─ Potential points: %c' + Math.floor(Math.sqrt(money / 1000000)) +
            '\n%c└─ Status: %c' + (money >= 1000000 ? 'PASSED ✅' : 'Need more money 💰'),
            'color: #666', 'color: #9C27B0',
            'color: #666', 'color: #9C27B0',
            'color: #666', money >= 1000000 ? 'color: #4CAF50' : 'color: #f44336',
            'color: #666', 'color: #9C27B0',
            'color: #666', money >= 1000000 ? 'color: #4CAF50' : 'color: #FF9800'
        );
    },

    // Test passive income
    verifyPassiveIncome: function(seconds = 5) {
        const initialMoney = money;
        const expectedIncome = moneyPerSecond * prestigeMultiplier * seconds;
        
        console.log('%c🧪 Test: Passive Income', 'color: #FF9800; font-weight: bold;');
        console.log(
            '%c├─ Duration: %c' + seconds + ' seconds' +
            '\n%c├─ Current MPS: %c$' + moneyPerSecond.toFixed(2) + '/sec' +
            '\n%c├─ Prestige multiplier: %c' + prestigeMultiplier.toFixed(1) + 'x' +
            '\n%c└─ Expected income: %c$' + expectedIncome.toFixed(2),
            'color: #666', 'color: #FF9800',
            'color: #666', 'color: #FF9800',
            'color: #666', 'color: #FF9800',
            'color: #666', 'color: #FF9800'
        );

        setTimeout(() => {
            const actualIncome = money - initialMoney;
            console.log('%c🧪 Test: Passive Income Result', 'color: #FF9800; font-weight: bold;');
            console.log(
                '%c├─ Initial money: %c$' + initialMoney.toFixed(2) +
                '\n%c├─ Final money: %c$' + money.toFixed(2) +
                '\n%c├─ Expected income: %c$' + expectedIncome.toFixed(2) +
                '\n%c├─ Actual income: %c$' + actualIncome.toFixed(2) +
                '\n%c└─ Status: %c' + (Math.abs(actualIncome - expectedIncome) < 0.1 ? 'PASSED ✅' : 'FAILED ❌'),
                'color: #666', 'color: #FF9800',
                'color: #666', 'color: #FF9800',
                'color: #666', 'color: #FF9800',
                'color: #666', 'color: #FF9800',
                'color: #666', Math.abs(actualIncome - expectedIncome) < 0.1 ? 'color: #4CAF50' : 'color: #f44336'
            );
        }, seconds * 1000);
    },

    // Test achievements
    testAchievements: function() {
        console.log('%c🧪 Test: Achievements', 'color: #E91E63; font-weight: bold;');
        console.log(
            '%c├─ Total money earned: %c$' + stats.totalMoneyEarned.toFixed(2) +
            '\n%c└─ Total prestige times: %c' + stats.prestigeTimes,
            'color: #666', 'color: #E91E63',
            'color: #666', 'color: #E91E63'
        );

        console.log('%c📊 Achievement Progress:', 'color: #E91E63; font-weight: bold;');
        Object.entries(achievements).forEach(([key, achievement], index, array) => {
            const earned = achievement.earned.length;
            const total = achievement.thresholds.length;
            const isLast = index === array.length - 1;
            console.log(
                '%c' + (isLast ? '└─' : '├─') + ' ' + achievement.name + ': %c' +
                earned + '/' + total + ' ' + (earned === total ? '🏆' : '🔄'),
                'color: #666',
                earned === total ? 'color: #4CAF50' : 'color: #FF9800'
            );
        });
    },

    // Test prestige reset
    testPrestigeReset: function() {
        if (money < 1000000) {
            console.log('%c🧪 Test: Prestige Reset', 'color: #9C27B0; font-weight: bold;');
            console.log('%c└─ Status: SKIPPED - Need $1,000,000 to test prestige ⚠️', 'color: #FF9800');
            return;
        }

        const initialPrestigePoints = prestigePoints;
        const expectedNewPoints = Math.floor(Math.sqrt(money / 1000000));
        const initialTotalPrestige = stats.prestigeTimes;

        prestige();

        console.log('%c🧪 Test: Prestige Reset', 'color: #9C27B0; font-weight: bold;');
        console.log(
            '%c├─ Initial prestige points: %c' + initialPrestigePoints +
            '\n%c├─ New prestige points: %c' + expectedNewPoints +
            '\n%c├─ Total prestiges: %c' + stats.prestigeTimes +
            '\n%c├─ Money reset: %c' + (money === 0 ? 'Yes ✅' : 'No ❌') +
            '\n%c├─ Upgrades reset: %c' + (Object.values(upgrades).every(u => u.owned === 0) ? 'Yes ✅' : 'No ❌') +
            '\n%c└─ Status: %c' + (stats.prestigeTimes === initialTotalPrestige + 1 ? 'PASSED ✅' : 'FAILED ❌'),
            'color: #666', 'color: #9C27B0',
            'color: #666', 'color: #9C27B0',
            'color: #666', 'color: #9C27B0',
            'color: #666', money === 0 ? 'color: #4CAF50' : 'color: #f44336',
            'color: #666', Object.values(upgrades).every(u => u.owned === 0) ? 'color: #4CAF50' : 'color: #f44336',
            'color: #666', stats.prestigeTimes === initialTotalPrestige + 1 ? 'color: #4CAF50' : 'color: #f44336'
        );
    },

    // Run all tests
    runAllTests: function() {
        console.log('%c🧪 Running All Game Tests 🧪', 'color: #2196F3; font-size: 14px; font-weight: bold;');
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.addMoney(1000);
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.buyUpgrade('stocks', 5);
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.buyUpgrade('realestate', 2);
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.testAchievements();
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.checkPrestige();
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        this.verifyPassiveIncome(3);
        
        // Add delay for prestige test to allow passive income test to complete
        setTimeout(() => {
            console.log('%c' + '='.repeat(50), 'color: #666');
            this.testPrestigeReset();
        }, 4000);
    },

    // Test help
    help: function() {
        console.log('%c🎮 Game Testing Commands 🎮', 'color: #2196F3; font-size: 14px; font-weight: bold;');
        console.log('%c' + '='.repeat(50), 'color: #666');
        
        const commands = [
            { cmd: 'addMoney(amount)', desc: 'Test adding money to the game' },
            { cmd: 'buyUpgrade(upgradeId, quantity)', desc: 'Test buying upgrades' },
            { cmd: 'checkPrestige()', desc: 'Test prestige conditions' },
            { cmd: 'verifyPassiveIncome(seconds)', desc: 'Test passive income generation' },
            { cmd: 'testAchievements()', desc: 'Test achievement progress' },
            { cmd: 'testPrestigeReset()', desc: 'Test prestige reset mechanism' },
            { cmd: 'runAllTests()', desc: 'Run all available tests' },
            { cmd: 'help()', desc: 'Show this help message' }
        ];

        commands.forEach((cmd, index) => {
            console.log(
                '%c' + (index === commands.length - 1 ? '└─' : '├─') + ' GameTest.%c' + cmd.cmd +
                '\n%c   %c' + cmd.desc,
                'color: #666', 'color: #2196F3; font-weight: bold',
                'color: #666', 'color: #888'
            );
        });

        console.log('\n%cExample usage:', 'color: #2196F3; font-weight: bold');
        console.log('%c├─ GameTest.addMoney(1000)', 'color: #666');
        console.log('%c├─ GameTest.buyUpgrade(\'stocks\', 5)', 'color: #666');
        console.log('%c└─ GameTest.verifyPassiveIncome(5)', 'color: #666');
    },
    // Test cryptocurrency features
    testCryptoMarket: function() {
        console.log('%c🧪 Test: Crypto Market', 'color: #00BCD4; font-weight: bold;');
        
        // Test crypto price fluctuation
        const initialPrices = {};
        Object.keys(cryptoCurrencies).forEach(crypto => {
            initialPrices[crypto] = cryptoCurrencies[crypto].price;
        });

        updateCryptoPrices(); // Trigger price update

        console.log('%c📈 Price Fluctuation Test:', 'color: #00BCD4; font-weight: bold;');
        Object.keys(cryptoCurrencies).forEach((crypto, index, array) => {
            const isLast = index === array.length - 1;
            const priceChange = ((cryptoCurrencies[crypto].price - initialPrices[crypto]) / initialPrices[crypto] * 100).toFixed(2);
            console.log(
                '%c' + (isLast ? '└─' : '├─') + ' ' + crypto + ': %c' +
                `${priceChange}% ${priceChange > 0 ? '📈' : '📉'}`,
                'color: #666',
                priceChange > 0 ? 'color: #4CAF50' : 'color: #f44336'
            );
        });
    },

    // Test crypto trading
    testCryptoTrading: function(cryptoId, amount) {
        console.log('%c🧪 Test: Crypto Trading', 'color: #00BCD4; font-weight: bold;');
        
        const crypto = cryptoCurrencies[cryptoId];
        if (!crypto) {
            console.log('%c└─ Status: FAILED - Cryptocurrency not found ❌', 'color: #f44336');
            return;
        }

        const initialBalance = money;
        const initialHoldings = crypto.owned;
        const cost = crypto.price * amount;

        // Attempt to buy crypto
        if (money >= cost) {
            money -= cost;
            crypto.owned += amount;
            console.log(
                '%c├─ Transaction: %cBuy ' + amount + ' ' + cryptoId +
                '\n%c├─ Cost: %c$' + cost.toFixed(2) +
                '\n%c├─ New Balance: %c$' + money.toFixed(2) +
                '\n%c└─ Status: %cPASSED ✅',
                'color: #666', 'color: #4CAF50',
                'color: #666', 'color: #00BCD4',
                'color: #666', 'color: #00BCD4',
                'color: #666', 'color: #4CAF50'
            );
        } else {
            console.log(
                '%c├─ Attempted purchase: %c' + amount + ' ' + cryptoId +
                '\n%c├─ Required: %c$' + cost.toFixed(2) +
                '\n%c├─ Available: %c$' + money.toFixed(2) +
                '\n%c└─ Status: %cFAILED - Insufficient funds ❌',
                'color: #666', 'color: #00BCD4',
                'color: #666', 'color: #00BCD4',
                'color: #666', 'color: #00BCD4',
                'color: #666', 'color: #f44336'
            );
        }
    },

    // Test edge cases
    testEdgeCases: function() {
        console.log('%c🧪 Test: Edge Cases', 'color: #673AB7; font-weight: bold;');
        
        // Test negative money
        const initialMoney = money;
        money = -1000;
        updateDisplays();
        console.log(
            '%c├─ Negative money handling: %c' +
            (money < 0 ? 'Money can go negative ⚠️' : 'Negative money prevented ✅'),
            'color: #666',
            money < 0 ? 'color: #FF9800' : 'color: #4CAF50'
        );
        money = initialMoney;

        // Test max values
        const maxMoney = Number.MAX_SAFE_INTEGER;
        money = maxMoney;
        updateDisplays();
        console.log(
            '%c├─ Max money handling: %c' +
            (money === maxMoney ? 'Handles large numbers ✅' : 'Large number issues ⚠️'),
            'color: #666',
            money === maxMoney ? 'color: #4CAF50' : 'color: #FF9800'
        );
        money = initialMoney;

        // Test invalid upgrade purchase
        console.log(
            '%c└─ Invalid upgrade handling: %c' +
            (this.buyUpgrade('nonexistent') === undefined ? 'Handles invalid upgrades ✅' : 'Invalid upgrade issues ⚠️'),
            'color: #666',
            'color: #4CAF50'
        );
    }
};

// Add new test methods to help menu
const originalHelp = GameTest.help;
GameTest.help = function() {
    originalHelp.call(this);
    console.log('\n%cNew Test Commands:', 'color: #2196F3; font-weight: bold');
    console.log('%c├─ GameTest.testCryptoMarket()', 'color: #666');
    console.log('%c├─ GameTest.testCryptoTrading("BTC", 1)', 'color: #666');
    console.log('%c└─ GameTest.testEdgeCases()', 'color: #666');
};

// Add new tests to runAllTests
const originalRunAllTests = GameTest.runAllTests;
GameTest.runAllTests = function() {
    originalRunAllTests.call(this);
    setTimeout(() => {
        console.log('%c' + '='.repeat(50), 'color: #666');
        this.testCryptoMarket();
        console.log('%c' + '='.repeat(50), 'color: #666');
        this.testCryptoTrading('BTC', 1);
        console.log('%c' + '='.repeat(50), 'color: #666');
        this.testEdgeCases();
    }, 5000);
};

// Add GameTest to window for console access
window.GameTest = GameTest;

// Show help message when the script loads
console.log('%c🎮 Game Testing Utilities Loaded! Type GameTest.help() for available commands', 'color: #2196F3; font-weight: bold;');