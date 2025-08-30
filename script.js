let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForOperand = false;

// Item data with prices and emojis for wealth comparisons
const items = [
    { name: 'cups of coffee', price: 5, emoji: '☕' },
    { name: 'Big Macs', price: 6, emoji: '🍔' },
    { name: 'movie tickets', price: 15, emoji: '🎬' },
    { name: 'pizza slices', price: 3, emoji: '🍕' },
    { name: 'iPhone 15 Pro Max', price: 1199, emoji: '📱' },
    { name: 'Tesla Model 3s', price: 40000, emoji: '🚗' },
    { name: 'Mini Cooper cars', price: 32000, emoji: '🚙' },
    { name: 'Rolex watches', price: 8000, emoji: '⌚' },
    { name: 'MacBook Pros', price: 2500, emoji: '💻' },
    { name: 'bicycles', price: 500, emoji: '🚲' },
    { name: 'pairs of Air Jordans', price: 200, emoji: '👟' },
    { name: 'bottles of champagne', price: 150, emoji: '🍾' },
    { name: 'gaming consoles', price: 500, emoji: '🎮' },
    { name: 'designer handbags', price: 3000, emoji: '👜' },
    { name: 'oranges', price: 0.75, emoji: '🍊' },
    { name: 'bananas', price: 0.25, emoji: '🍌' },
    { name: 'gallons of milk', price: 4, emoji: '🥛' },
    { name: 'loaves of bread', price: 3, emoji: '🍞' },
    { name: 'pounds of avocados', price: 2.50, emoji: '🥑' },
    { name: 'bottles of water', price: 1, emoji: '💧' },
    { name: 'dozen eggs', price: 3, emoji: '🥚' },
    { name: 'luxury yachts', price: 5000000, emoji: '🛥️' },
    { name: 'private jets', price: 25000000, emoji: '✈️' },
    { name: 'mansions', price: 2000000, emoji: '🏰' },
    { name: 'lamborghinis', price: 250000, emoji: '🏎️' },
    { name: 'helicopters', price: 1500000, emoji: '🚁' },
    { name: 'McDonald\'s franchise licenses', price: 450000, emoji: '🍟' },
    { name: 'average Minnesota houses', price: 350000, emoji: '🏠' },
    { name: 'rubber duckies', price: 2, emoji: '🦆' },
    { name: 'base set Charizard Pokemon cards', price: 50000, emoji: '🔥' },
    { name: 'individual Skittles', price: 0.01, emoji: '🌈' },
    { name: 'different colored 2x4 Lego bricks', price: 0.50, emoji: '🧱' }
];

function updateDisplay() {
    let displayValue = currentInput;
    
    // Handle very long numbers
    if (displayValue.length > 12) {
        if (displayValue.includes('.')) {
            const parts = displayValue.split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1];
            
            if (integerPart.length > 8) {
                displayValue = parseFloat(currentInput).toExponential(5);
            } else {
                const maxDecimalPlaces = 11 - integerPart.length;
                displayValue = parseFloat(currentInput).toFixed(Math.max(0, maxDecimalPlaces));
            }
        } else {
            displayValue = parseFloat(currentInput).toExponential(5);
        }
    }
    
    if (!displayValue.includes('e') && displayValue.length <= 12) {
        const num = parseFloat(displayValue);
        if (Math.abs(num) >= 1000 && !displayValue.includes('.')) {
            displayValue = num.toLocaleString();
        }
    }
    
    display.textContent = displayValue;
}

function formatQuantity(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + ' thousand';
    if (num >= 1) return Math.floor(num).toLocaleString();
    return (num * 100).toFixed(0) + ' cents worth';
}

function getRandomItem(amount) {
    const validItems = items.filter(item => {
        const quantity = amount / item.price;
        return quantity >= 1 && quantity < 50000; // Reasonable display range
    });

    if (validItems.length === 0) return null;
    
    return validItems[Math.floor(Math.random() * validItems.length)];
}

function showWealthComparison(amount) {
    const wealthDisplay = document.getElementById('wealthDisplay');
    const wealthHeader = document.getElementById('wealthHeader');
    const wealthContent = document.getElementById('wealthContent');
    
    // Activate the display
    wealthDisplay.classList.add('active');
    
    // Show loading
    wealthContent.innerHTML = '<div class="loading-wealth">Calculating wealth...</div>';
    
    setTimeout(() => {
        const randomItem = getRandomItem(amount);
        
        if (!randomItem) {
            wealthContent.innerHTML = `
                <div class="waiting-message">
                    ${amount < 1 ? 'Amount too small!' : 'Amount too large for comparisons!'}
                </div>
            `;
            return;
        }
        
        const quantity = Math.floor(amount / randomItem.price);
        const displayQuantity = Math.min(quantity, 100);
        const emojiString = randomItem.emoji.repeat(displayQuantity);
        const remainingText = quantity > 100 ? `\n+ ${quantity - 100} more!` : '';
        
        // Format the amount in the header
        let formattedAmount;
        if (amount >= 1e6) formattedAmount = '$' + (amount / 1e6).toFixed(1) + 'M';
        else if (amount >= 1e3) formattedAmount = '$' + (amount / 1e3).toFixed(1) + 'K';
        else formattedAmount = '$' + amount.toLocaleString();
        
        wealthHeader.textContent = formattedAmount + ' CAN BUY...';
        
        wealthContent.innerHTML = `
            <div class="item-quantity">${formatQuantity(quantity)}</div>
            <div class="item-name">${randomItem.name}</div>
            <div class="emoji-showcase">${emojiString}${remainingText}</div>
        `;
    }, 800);
}

function appendToDisplay(value) {
    createRipple(event);
    
    if (waitingForOperand) {
        currentInput = value;
        waitingForOperand = false;
    } else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            if (currentInput.length < 15) {
                currentInput += value;
            }
        }
    }
    
    if (['+', '-', '*', '/'].includes(value)) {
        if (operator && !waitingForOperand) {
            calculate();
        }
        
        previousInput = currentInput;
        operator = value;
        waitingForOperand = true;
        return;
    }
    
    updateDisplay();
}

function calculate() {
    createRipple(event);
    
    if (operator && previousInput !== null && !waitingForOperand) {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        try {
            switch (operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            operator = null;
            previousInput = null;
            waitingForOperand = true;
            
            if (result > 0) {
                showWealthComparison(result);
            }
            
        } catch (error) {
            currentInput = 'Error';
            display.classList.add('error');
            setTimeout(() => display.classList.remove('error'), 500);
            
            setTimeout(() => {
                clearDisplay();
            }, 1500);
        }
    } else {
        const currentAmount = parseFloat(currentInput);
        if (currentAmount > 0) {
            showWealthComparison(currentAmount);
        }
    }
    
    updateDisplay();
}

function clearDisplay() {
    createRipple(event);
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForOperand = false;
    updateDisplay();
}

function deleteLast() {
    createRipple(event);
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    
    updateDisplay();
}

function createRipple(event) {
    const button = event.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}



// Navigation functions
function toggleHamburger() {
    const menu = document.getElementById('hamburgerMenu');
    menu.classList.toggle('open');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close hamburger menu if open
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerMenu && hamburgerMenu.classList.contains('open')) {
            hamburgerMenu.classList.remove('open');
        }
    });
});

// Close hamburger when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('hamburgerMenu');
    const btn = document.querySelector('.hamburger-btn');
    
    if (menu && menu.classList.contains('open') && 
        !menu.contains(e.target) && 
        !btn.contains(e.target)) {
        menu.classList.remove('open');
    }
});

// Keyboard support for calculator
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.reset();
});

updateDisplay();