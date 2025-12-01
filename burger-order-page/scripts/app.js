document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const menu = document.getElementById('menu');
    const cartList = document.getElementById('cart-list');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const categoryNav = document.getElementById('category-nav');

    // Combo Modal Elements
    const comboModal = document.getElementById('combo-modal');
    const closeButton = document.querySelector('.close-button');
    const comboBurgerName = document.getElementById('combo-burger-name');
    const comboTotalSpan = document.getElementById('combo-total');
    const comboSelector = document.getElementById('combo-selector');
    const addComboButton = document.getElementById('add-combo-to-cart');
    const addBurgerOnlyButton = document.getElementById('add-burger-only');
    const sizeOptions = document.getElementById('size-options');
    
    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutCloseButton = document.querySelector('.checkout-close-button');
    const finalCheckoutTotal = document.getElementById('final-checkout-total');
    const eatHereBtn = document.getElementById('eat-here-btn');
    const takeAwayBtn = document.getElementById('take-away-btn');
    
    let cart = []; 
    let selectedBurger = { 
        basePrice: 0, 
        currentPrice: 0, 
        name: '' 
    }; 

    // --- CATEGORY FILTERING LOGIC ---
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

    // --- COMBO PRICE/SIZE LOGIC ---
    function calculateComboPrice() {
        const burgerPrice = selectedBurger.currentPrice || 0; 
        const selectedDrinkInput = comboSelector.querySelector('input[name="drink"]:checked');
        const selectedSideInput = comboSelector.querySelector('input[name="side"]:checked');

        const drinkPrice = selectedDrinkInput ? parseFloat(selectedDrinkInput.dataset.price) : 0;
        const sidePrice = selectedSideInput ? parseFloat(selectedSideInput.dataset.price) : 0;
        
        const currentTotal = burgerPrice + drinkPrice + sidePrice;
        comboTotalSpan.textContent = currentTotal.toFixed(2);
    }
    
    function updateBurgerPrice() {
        const selectedSizeInput = sizeOptions.querySelector('input[name="size"]:checked');
        if (selectedSizeInput) {
            const modifier = parseFloat(selectedSizeInput.dataset.modifier);
            selectedBurger.currentPrice = selectedBurger.basePrice + modifier;
        }
        calculateComboPrice();
    }

    // --- EVENT LISTENERS ---

    // 1. Menu Clicks (Combo & Simple buttons)
    menu.addEventListener('click', (event) => {
        const target = event.target;
        const itemElement = target.closest('.menu-item');
        if (!itemElement) return;

        const itemName = itemElement.dataset.name;
        const itemPrice = parseFloat(itemElement.dataset.price);

        if (target.classList.contains('add-to-cart')) {
            // A. Burger Combo Button: Open the combo modal
            selectedBurger.name = itemName;
            selectedBurger.basePrice = itemPrice;
            
            comboBurgerName.textContent = selectedBurger.name;
            comboModal.style.display = 'block';

            sizeOptions.querySelector('input[value="Standard"]').checked = true;
            comboSelector.querySelectorAll('input[name="drink"], input[name="side"]').forEach(radio => radio.checked = false);
            
            updateBurgerPrice(); 

        } else if (target.classList.contains('add-to-cart-simple')) {
            // B. Side/Drink Simple Button: Add item directly to cart
            addItemToCart(itemName, itemPrice);
        }
    });

    // 2. Combo Modal option changes
    sizeOptions.addEventListener('change', updateBurgerPrice);
    comboSelector.addEventListener('change', calculateComboPrice);

    // 3. 'Skip Combo & Add Burger Only' handler
    addBurgerOnlyButton.addEventListener('click', () => {
        const selectedSize = sizeOptions.querySelector('input[name="size"]:checked').value;
        const finalName = `${selectedBurger.name} (${selectedSize})`;
        
        addItemToCart(finalName, selectedBurger.currentPrice);
        comboModal.style.display = 'none'; 
    });

    // 4. 'Add Combo to Cart' button handler
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

    // 5. Combo Modal closing logic 
    closeButton.onclick = () => {
        comboModal.style.display = 'none';
    }


    // --- CHECKOUT LOGIC MODIFICATIONS ---

    // 6. Checkout button: Opens the new confirmation modal
    checkoutButton.addEventListener('click', () => {
        const currentTotal = totalPriceSpan.textContent;
        finalCheckoutTotal.textContent = currentTotal;
        checkoutModal.style.display = 'block';
    });

    // 7. Checkout Option Handlers (Final confirmation)
    const finalizeOrder = (orderType) => {
        const currentTotal = finalCheckoutTotal.textContent;
        alert(`Thank you for your order! Your total is ${currentTotal}. We confirm your choice: ${orderType}.`);
        
        // Finalize: Clear cart and close modal
        cart = []; 
        updateCartUI(); 
        checkoutModal.style.display = 'none';
    };

    eatHereBtn.addEventListener('click', () => {
        finalizeOrder('Eat Here');
    });

    takeAwayBtn.addEventListener('click', () => {
        finalizeOrder('Take Away');
    });

    // 8. Checkout Modal closing logic
    checkoutCloseButton.onclick = () => {
        checkoutModal.style.display = 'none';
    }
    window.onclick = (event) => {
        if (event.target == comboModal) {
            comboModal.style.display = 'none';
        }
        if (event.target == checkoutModal) { 
            checkoutModal.style.display = 'none';
        }
    }


    // --- CART MANAGEMENT FUNCTIONS ---

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
    
    // Initialize: Show all items on load
    document.querySelector('.category-btn[data-category="all"]').click();
});