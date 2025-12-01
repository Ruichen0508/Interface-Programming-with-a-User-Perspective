document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const cartList = document.getElementById('cart-list');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    
    let cart = []; // Array to store cart items

    // 1. Listen for click events on all "Add to Cart" buttons
    menu.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const itemElement = event.target.closest('.menu-item');
            const itemName = itemElement.dataset.name;
            const itemPrice = parseFloat(itemElement.dataset.price);

            // Add the item to the cart
            addItemToCart(itemName, itemPrice);
        }
    });

    // 2. Add an item to the cart and update the UI
    function addItemToCart(name, price) {
        // Check if the item already exists in the cart
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; // Increment quantity
        } else {
            cart.push({ name: name, price: price, quantity: 1 }); // Add for the first time
        }

        updateCartUI();
    }

    // 3. Update the cart list and the total price
    function updateCartUI() {
        cartList.innerHTML = ''; // Clear the current list

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Create a new list item element
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
        
        // Enable/Disable the checkout button
        checkoutButton.disabled = cart.length === 0;
    }
    
    // 4. Checkout button logic (can be expanded to a popup)
    checkoutButton.addEventListener('click', () => {
        alert(`Thank you for your order! Your total is ${totalPriceSpan.textContent}. Your burgers are being prepared!`);
        cart = []; // Clear the cart
        updateCartUI(); // Update the interface
    });
});