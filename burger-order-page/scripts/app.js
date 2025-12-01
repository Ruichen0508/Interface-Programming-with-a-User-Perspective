document.addEventListener('DOMContentLoaded', () => {
    // Get references to the key elements in the HTML
    const menu = document.getElementById('menu');
    const cartList = document.getElementById('cart-list');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    
    let cart = []; // Array to store cart items: [{ name: '...', price: X, quantity: Y }, ...]

    // 1. EVENT LISTENER: Listen for click events inside the entire menu area
    menu.addEventListener('click', (event) => {
        // Check if the element clicked has the class 'add-to-cart'
        if (event.target.classList.contains('add-to-cart')) {
            
            // Find the closest parent element with the class 'menu-item'
            const itemElement = event.target.closest('.menu-item');
            
            // IMPORTANT: Get data from the 'data-name' and 'data-price' attributes
            const itemName = itemElement.dataset.name;
            const itemPrice = parseFloat(itemElement.dataset.price);

            // Call the function to handle adding the item
            addItemToCart(itemName, itemPrice);
        }
    });

    // 2. FUNCTION: Add an item to the cart array and update the UI
    function addItemToCart(name, price) {
        // Check if the item already exists in the cart array
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; // Item found, just increment quantity
        } else {
            // Item not found, add a new item object
            cart.push({ name: name, price: price, quantity: 1 }); 
        }

        // Always call the UI update function after changing the cart data
        updateCartUI();
    }

    // 3. FUNCTION: Update the cart list and the total price displayed on the screen
    function updateCartUI() {
        cartList.innerHTML = ''; // Clear the current list
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Create and append the new list item element
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            cartList.appendChild(li);
        });

        // Update the total price display
        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
        
        // Enable/Disable the checkout button based on if the cart is empty
        checkoutButton.disabled = cart.length === 0;
    }
    
    // 4. CHECKOUT LOGIC
    checkoutButton.addEventListener('click', () => {
        alert(`Thank you for your order! Your total is ${totalPriceSpan.textContent}.`);
        cart = []; // Clear the cart
        updateCartUI(); // Update the interface
    });
});