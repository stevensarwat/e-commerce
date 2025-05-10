// DOM Elements
const cartItemsContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout");

// Tax rate
const TAX_RATE = 0.05;

// Render cart items
function renderTheOrder() {
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  if (cart.length == 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Go to <a href="products.html">products page</a> to add items to your cart.</p>
            </div>
        `;
    updateOrderSummary(0);
    return; //exit here => will not go to  foreach
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="category">${item.category}</div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${
      item.quantity - 1
    })">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${
      item.quantity + 1
    })">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${
                  item.id
                })">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
    cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
  });

  updateOrderSummary(subtotal);
}

// Update cart summary
function updateOrderSummary(subtotal) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity in local storage
window.updateQuantity = function (productId, newQuantity) {
  if (newQuantity < 1) return;

  const itemIndex = cart.findIndex((item) => item.id == productId);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart)); //replace existing in local storge
    renderTheOrder();
    updateCartCount();
  }
};

// Remove item from cart
window.removeFromCart = function (productId) {
  cart = cart.filter((item) => item.id != productId);
  console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderTheOrder();
  updateCartCount();
};

// Clear cart
clearCartButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderTheOrder();
    updateCartCount();
  }
});

// Checkout process
checkoutButton.addEventListener("click", async () => {
  if (!isLoggedIn()) {
    alert("Please log in to checkout");
    window.location.href = "login.html";
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    const orders = cart.map((item) => ({
      orderID: generateOrderId(),
      productId: item.id,
      quantity: item.quantity,
      status: "pending",
      sellerId: item.sellerId || "01254", // Default seller ID if not specified
    }));

    const response = await fetch("http://localhost:3000/users/" + userId);
    const user = await response.json();

    // Add new orders to user's orders array
    user.orders = [...user.orders, ...orders];

    // Update user data in db.json
    await fetch("http://localhost:3000/users/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Clear cart after successful checkout
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderTheOrder();
    updateCartCount();

    alert("Order placed successfully!");
  } catch (error) {
    console.error("Checkout error:", error);
    alert("An error occurred during checkout. Please try again.");
  }
});

// Generate unique order ID
function generateOrderId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("userId") !== null;
}

// 1-Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  renderTheOrder();
  updateCartCount();
});
