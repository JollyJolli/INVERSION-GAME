// Card game module for Higher/Lower betting game using Deck of Cards API
let deckId = null;
let currentCard = null;
let consecutiveWins = 0;
let minBet = 10;

// Initialize new deck from the API
async function initializeDeck() {
    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
        const data = await response.json();
        deckId = data.deck_id;
    } catch (error) {
        console.error('Error initializing deck:', error);
    }
}

// Draw a card from the API deck
async function drawCard() {
    if (!deckId) {
        await initializeDeck();
    }
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        
        if (data.remaining === 0) {
            await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        }
        
        return data.cards[0];
    } catch (error) {
        console.error('Error drawing card:', error);
        return null;
    }
}

// Convert numeric values for cards
function getNumericValue(card) {
    const values = {
        'ACE': 1,
        'JACK': 11,
        'QUEEN': 12,
        'KING': 13
    };
    return values[card.value] || parseInt(card.value);
}

// Calculate win multiplier based on consecutive wins
function getWinMultiplier() {
    return 1 + (consecutiveWins * 0.5);
}

// Initialize the card game UI
function initializeCardGame() {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'card-game-container';
    gameContainer.innerHTML = `
        <div class="game-section">
            <h2><i class="fas fa-cards"></i> Higher or Lower</h2>
            <div class="card-display">
                <div class="current-card">?
                </div>
            </div>
            <div class="betting-controls">
                <input type="number" class="bet-amount" placeholder="Bet Amount" min="${minBet}" step="1">
                <div class="prediction-buttons">
                    <button class="predict-higher">Higher ↑</button>
                    <button class="predict-lower">Lower ↓</button>
                </div>
            </div>
            <div class="game-stats">
                <span class="consecutive-wins">Streak: 0</span>
                <span class="multiplier">Multiplier: 1x</span>
            </div>
        </div>
    `;
    
    document.querySelector('.game-container').appendChild(gameContainer);
    initializeDeck();
    setupCardGameListeners(gameContainer);
}

// Set up event listeners for the card game
function setupCardGameListeners(container) {
    const higherBtn = container.querySelector('.predict-higher');
    const lowerBtn = container.querySelector('.predict-lower');
    const betInput = container.querySelector('.bet-amount');
    const cardDisplay = container.querySelector('.current-card');
    
    function updateDisplay() {
        container.querySelector('.consecutive-wins').textContent = `Streak: ${consecutiveWins}`;
        container.querySelector('.multiplier').textContent = `Multiplier: ${getWinMultiplier()}x`;
        
        if (currentCard) {
            cardDisplay.innerHTML = `
                <img src="${currentCard.image}" alt="${currentCard.value} of ${currentCard.suit}" class="card-image">
            `;
        } else {
            cardDisplay.innerHTML = `
                <img src="https://deckofcardsapi.com/static/img/back.png" alt="Card Back" class="card-image">
            `;
        }
    }
    async function handlePrediction(isHigher) {
        const betAmount = parseInt(betInput.value);
        
        if (isNaN(betAmount) || betAmount < minBet) {
            alert(`Please enter a valid bet amount (minimum $${minBet})`);
            return;
        }
        
        if (betAmount > money) {
            alert('Insufficient funds for this bet!');
            return;
        }
        
        try {
            if (!currentCard) {
                currentCard = await drawCard();
            }
            
            const newCard = await drawCard();
            if (!newCard) {
                alert('Error drawing card. Please try again.');
                return;
            }
            
            const oldValue = getNumericValue(currentCard);
            const newValue = getNumericValue(newCard);
            const result = newValue - oldValue;
            const won = (isHigher && result > 0) || (!isHigher && result < 0);
            
            if (won) {
                consecutiveWins++;
                const winnings = Math.floor(betAmount * getWinMultiplier());
                money += winnings;
                alert(`You won $${winnings}! 🎉`);
            } else {
                consecutiveWins = 0;
                money -= betAmount;
                alert('Better luck next time! 😢');
            }
            
            currentCard = newCard;
            updateDisplay();
            updateDisplays(); // Update money display
        } catch (error) {
            console.error('Error during prediction:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    higherBtn.addEventListener('click', () => handlePrediction(true));
    lowerBtn.addEventListener('click', () => handlePrediction(false));
    
    // Initial display update
    updateDisplay();
}

// Initialize the card game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.game-container')) {
        initializeCardGame();
    }
});