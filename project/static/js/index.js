import {User, get} from './db/userDB.js'

window.addEventListener('load', async function(e) {
    let data = await get();
    console.log(data);
    for (const el of data) {
        console.log(el instanceof User);
    }
    updateCartCount();
    document.body.style.backgroundColor = "var(--background)";
    document.body.style.color = "var(--text-primary)";
});

// Cart functionality
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    // Get cart items from localStorage or set to 0 if none exist
    const count = JSON.parse(localStorage.getItem('cartItems'))?.length || 0;
    cartCount.textContent = count;
}

// Ensure menu items have correct text color
document.querySelectorAll('nav ul li a').forEach(link => {
    link.style.color = 'var(--text-primary)';
});

// Make menutoggle function globally available
window.menutoggle = menutoggle;