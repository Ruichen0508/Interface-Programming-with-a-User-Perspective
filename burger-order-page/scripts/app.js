document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const menu = document.getElementById('menu');
    const cartList = document.getElementById('cart-list');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const categoryNav = document.getElementById('category-nav'); 

    // Modal Elements
    const comboModal = document.getElementById('combo-modal');
    const closeButton = document.querySelector('.close-button');
    const comboBurgerName = document.getElementById('combo-burger-name');
    const comboTotalSpan = document.getElementById('combo-total');
    const comboSelector = document.getElementById('combo-selector');
    const addComboButton = document.getElementById('add-combo-to-cart');
    const addBurgerOnlyButton = document.getElementById('add-burger-only');
    
    // NEW ELEMENT: Size Selector
    const sizeOptions = document.getElementById('size-options');

    let cart = []; 
    // Now stores basePrice and currentPrice
    let selectedBurger = { 
        basePrice: 0, 
        currentPrice: 0, 
        name: '' 
    }; 

    // --- NEW: CATEGORY FILTERING LOGIC (Unchanged) ---
    categoryNav.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('category-btn')) {
            const selectedCategory = target.dataset.category;
            const allMenuItems = menu.querySelectorAll('.menu-item');
            
            categoryNav.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            target.classList.add('active');
            
            allMenuItems.forEach(item => {
                const itemCategory = item.dataset.category;
                
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
    });

    // --- HELPER FUNCTION: Calculate Combo Price ---
    function calculateComboPrice() {
        // Use the current adjusted price of the burger
        const burgerPrice = selectedBurger.currentPrice || 0; 
        
        // Find selected drink and side
        const selectedDrinkInput = comboSelector.querySelector('input[name="drink"]:checked');
        const selectedSideInput = comboSelector.querySelector('input[name="side"]:checked');

        const drinkPrice = selectedDrinkInput ? parseFloat(selectedDrinkInput.dataset.price) : 0;
        const sidePrice = selectedSideInput ? parseFloat(selectedSideInput.dataset.price) : 0;
        
        const currentTotal = burgerPrice + drinkPrice + sidePrice;
        comboTotalSpan.textContent = currentTotal.toFixed(2);
    }
    
    // --- NEW: Function to update burger price based on size ---
    function updateBurgerPrice() {
        const selectedSizeInput = sizeOptions.querySelector('input[name="size"]:checked');
        if (selectedSizeInput) {
            const modifier = parseFloat(selectedSizeInput.dataset.modifier);
            // Update the burger's current price
            selectedBurger.currentPrice = selectedBurger.basePrice + modifier;
        }
        calculateComboPrice();
    }

    // --- EVENT LISTENERS ---

    // 1. Listen for clicks on the main menu area (Combo & Simple buttons)
    menu.addEventListener('click', (event) => {
        const target = event.target;
        const itemElement = target.closest('.menu-item');
        if (!itemElement) return;

        const itemName = itemElement.dataset.name;
        const itemPrice = parseFloat(itemElement.dataset.price);

        if (target.classList.contains('add-to-cart')) {
            // A. Burger Combo Button: Open the modal
            selectedBurger.name = itemName;
            selectedBurger.basePrice = itemPrice; // Store base price
            
            // Open modal and reset selections
            comboBurgerName.textContent = selectedBurger.name;
            comboModal.style.display = 'block';

            // Reset size to Standard (default selected)
            sizeOptions.querySelector('input[value="Standard"]').checked = true;
            
            // Reset other options
            comboSelector.querySelectorAll('input[name="drink"], input[name="side"]').forEach(radio => radio.checked = false);
            
            // Calculate initial price (Standard size)
            updateBurgerPrice(); 

        } else if (target.classList.contains('add-to-cart-simple')) {
            // B. Side/Drink Simple Button: Add item directly to cart
            addItemToCart(itemName, itemPrice);
        }
    });

    // 2. NEW: Listen for size changes in the modal (recalculate price)
    sizeOptions.addEventListener('change', updateBurgerPrice);

    // 3. Listen for other option changes (drink/side)
    comboSelector.addEventListener('change', calculateComboPrice);


    // 4. Handler for 'Skip Combo & Add Burger Only' button
    addBurgerOnlyButton.addEventListener('click', () => {
        // Add item using the currently selected size and price
        const selectedSize = sizeOptions.querySelector('input[name="size"]:checked').value;
        const finalName = `${selectedBurger.name} (${selectedSize})`;
        
        addItemToCart(finalName, selectedBurger.currentPrice);
        comboModal.style.display = 'none'; 
    });

    // 5. Add Combo to Cart button handler
    addComboButton.addEventListener('click', () => {
        const selectedDrink = comboSelector.querySelector('input[name="drink"]:checked');
        const selectedSide = comboSelector.querySelector('input[name="side"]:checked');
        const selectedSize = sizeOptions.querySelector('input[name="size"]:checked').value;

        let comboName = `${selectedBurger.name} (${selectedSize})`;
        let comboPrice = selectedBurger.currentPrice;

        if (selectedDrink || selectedSide) {
            const drinkName = selectedDrink ? selectedDrink.value : 'No Drink';
            const sideName = selectedSide ? selectedSide.value : 'No Side';
            
            comboName = `${selectedBurger.name} (${selectedSize}) Meal (w/ ${drinkName} & ${sideName})`;
            comboPrice = parseFloat(comboTotalSpan.textContent);
        }

        addItemToCart(comboName, comboPrice);
        comboModal.style.display = 'none'; 
    });

    // 6. Modal closing logic (unchanged)
    closeButton.onclick = () => {
        comboModal.style.display = 'none';
    }
    window.onclick = (event) => {
        if (event.target == comboModal) {
            comboModal.style.display = 'none';
        }
    }


    // --- CART MANAGEMENT FUNCTIONS (UNCHANGED) ---

    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }
        updateCartUI();
    }

    function updateItemQuantity(name, change) {
        const itemIndex = cart.findIndex(item => item.name === name);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            item.quantity += change;
            if (item.quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartList.innerHTML = ''; 
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.dataset.itemname = item.name; 

            li.innerHTML = `
                <span>${item.name}</span>
                <div class="quantity-control">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            cartList.appendChild(li);
        });

        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
        checkoutButton.disabled = cart.length === 0;
    }

    cartList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('quantity-btn')) {
            const itemName = target.closest('li').dataset.itemname;
            const action = target.dataset.action; 

            if (action === 'increase') {
                updateItemQuantity(itemName, 1);
            } else if (action === 'decrease') {
                updateItemQuantity(itemName, -1);
            }
        }
    });
    
    checkoutButton.addEventListener('click', () => {
        alert(`Thank you for your order! Your total is ${totalPriceSpan.textContent}.`);
        cart = []; 
        updateCartUI(); 
    });

    // Initialize: Show all items on load
    document.querySelector('.category-btn[data-category="all"]').click();
});