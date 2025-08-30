document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('wealthSlider');
    const dollarAmount = document.getElementById('dollarAmount');
    const resultsSection = document.getElementById('resultsSection');
    const comparisonsDiv = document.getElementById('comparisons');
    const loadingText = document.getElementById('loadingText');

    // Wealth amounts corresponding to slider values (now with decimal precision)
    function getWealthAmount(sliderValue) {
        const base = Math.floor(sliderValue / 10); // 3, 4, 5, 6, 7, 8, 9, 10, 11
        const decimal = (sliderValue % 10) / 10; // 0.0 to 0.9
        
        const baseAmounts = [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000];
        const baseAmount = baseAmounts[base - 3] || 1000;
        
        // Calculate the multiplier for decimal places
        const nextBaseAmount = baseAmounts[base - 2] || baseAmount * 10;
        const range = nextBaseAmount - baseAmount;
        
        return Math.round(baseAmount + (range * decimal));
    }

    // Item data with prices and emojis
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
        // New big ticket items for wealth perspective
        { name: 'McDonald\'s franchise licenses', price: 450000, emoji: '🍟' },
        { name: 'average Minnesota houses', price: 350000, emoji: '🏠' },
        { name: 'rubber duckies', price: 2, emoji: '🦆' },
        { name: 'base set Charizard Pokemon cards', price: 50000, emoji: '🔥' },
        { name: 'individual Skittles', price: 0.01, emoji: '🌈' },
        { name: 'different colored 2x4 Lego bricks', price: 0.50, emoji: '🧱' }
    ];

    function formatNumber(num) {
        if (num >= 1e12) return '$' + (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return '$' + (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return '$' + (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return '$' + (num / 1e3).toFixed(1) + 'K';
        return '$' + num.toLocaleString();
    }

    function formatQuantity(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + ' trillion';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + ' billion';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + ' million';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + ' thousand';
        if (num >= 1) return Math.floor(num).toLocaleString();
        return (num * 100).toFixed(0) + ' cents worth';
    }

    function getRandomItems(amount, count = 5) {
        const validItems = items.filter(item => {
            const quantity = amount / item.price;
            return quantity >= 1; // Only show items they can actually buy
        });

        // Shuffle and take random items
        const shuffled = validItems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function calculateComparisons() {
        const amount = getWealthAmount(slider.value);
        
        // Show loading
        resultsSection.classList.add('show');
        loadingText.style.display = 'block';
        comparisonsDiv.innerHTML = '';

        setTimeout(() => {
            loadingText.style.display = 'none';
            
            const selectedItems = getRandomItems(amount);
            
            selectedItems.forEach((item, index) => {
                const quantity = Math.floor(amount / item.price);
                
                // Only show if quantity is under 10,000
                if (quantity < 10000) {
                    const comparisonDiv = document.createElement('div');
                    comparisonDiv.className = 'comparison';
                    
                    // Add special styling for big ticket items
                    if (item.price >= 100000) {
                        comparisonDiv.classList.add('big-ticket');
                    }
                    
                    comparisonDiv.style.animationDelay = `${index * 0.1}s`;
                    
                    // Create emoji string (limit to reasonable display)
                    const displayQuantity = Math.min(quantity, 100); // Cap at 100 emojis for display
                    const emojiString = item.emoji.repeat(displayQuantity);
                    const remainingText = quantity > 100 ? ` + ${quantity - 100} more` : '';
                    
                    comparisonDiv.innerHTML = `
                        <div class="comparison-text">
                            ${formatQuantity(quantity)} ${item.name}
                        </div>
                        <div class="emoji-display">
                            ${emojiString}${remainingText}
                        </div>
                    `;
                    
                    comparisonsDiv.appendChild(comparisonDiv);
                }
            });

            // Add a special comparison for very large amounts (if under 10,000)
            if (amount >= 1000000000) { 
                const giveawayQuantity = Math.floor(amount / 1000);
                if (giveawayQuantity < 10000) {
                    const specialDiv = document.createElement('div');
                    specialDiv.className = 'comparison';
                    specialDiv.style.animationDelay = `${selectedItems.length * 0.1}s`;
                    
                    const displayQuantity = Math.min(giveawayQuantity, 100);
                    const emojiString = '🎁'.repeat(displayQuantity);
                    const remainingText = giveawayQuantity > 100 ? ` + ${giveawayQuantity - 100} more` : '';
                    
                    specialDiv.innerHTML = `
                        <div class="comparison-text">
                            Give $1,000 to ${formatQuantity(giveawayQuantity)} people
                        </div>
                        <div class="emoji-display">
                            ${emojiString}${remainingText}
                        </div>
                    `;
                    comparisonsDiv.appendChild(specialDiv);
                }
            }

            // If no items shown (all over 10,000), show a message
            if (comparisonsDiv.children.length === 0) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'comparison';
                messageDiv.innerHTML = `
                    <div class="comparison-text">
                        This amount is so large that individual item counts exceed 10,000!<br>
                        Try a smaller amount to see fun emoji comparisons 😄
                    </div>
                `;
                comparisonsDiv.appendChild(messageDiv);
            }
        }, 1500);
    }

    slider.addEventListener('input', function() {
        const amount = getWealthAmount(this.value);
        dollarAmount.textContent = formatNumber(amount);
        dollarAmount.classList.add('pulse');
        setTimeout(() => dollarAmount.classList.remove('pulse'), 500);
    });

    // Attach button handler
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateComparisons);

    // Initial calculation
    calculateComparisons();
});
