// Sample product data using images from static/images
let sampleProducts;
let filteredProducts;

async function fetchProducts() {
  try {
    const response =await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response);
    const data =await response.json();
    //mapping db.json products to my static products
    return data.map((prd) => ({
      id: prd.id,
      name: prd.name,
      price: prd.price,
      category: prd.cat,
      image: prd.images !== "" ? prd.images : "static/images/No_img_t.jpeg",
      sellerId: prd.sellerId,
    }));
  } catch (e) {
    console.log(`Fetch products failed: ${e}`);
    return [
      {
        id: 1,
        name: "Red Printed T-Shirt",
        price: 50.0,
        category: "shirt",
        image: "../static/images/product-1.jpg",
        //the real database has seller id
      },
      {
        id: 2,
        name: "HRX Sports Shoes",
        price: 75.0,
        category: "shoes",
        image: "../static/images/product-2.jpg",
      },
      {
        id: 3,
        name: "Casual Gray Pants",
        price: 45.0,
        category: "pants",
        image: "../static/images/product-3.jpg",
      },
      {
        id: 4,
        name: "Blue Printed T-Shirt",
        price: 55.0,
        category: "shirt",
        image: "../static/images/product-4.jpg",
      },
      {
        id: 5,
        name: "Gray Sports Shoes",
        price: 85.0,
        category: "shoes",
        image: "../static/images/product-5.jpg",
      },
      {
        id: 6,
        name: "Black Printed T-Shirt",
        price: 48.0,
        category: "shirt",
        image: "../static/images/product-6.jpg",
      },
      {
        id: 7,
        name: "HRX Cotton Socks",
        price: 15.0,
        category: "accessories",
        image: "../static/images/product-7.jpg",
      },
      {
        id: 8,
        name: "Black Watch",
        price: 120.0,
        category: "accessories",
        image: "../static/images/product-8.jpg",
      },
      {
        id: 9,
        name: "Sports Watch",
        price: 135.0,
        category: "accessories",
        image: "../static/images/product-9.jpg",
      },
      {
        id: 10,
        name: "Black Running Shoes",
        price: 95.0,
        category: "shoes",
        image: "../static/images/product-10.jpg",
      },
      {
        id: 12,
        name: "Black Track Pants",
        price: 40.0,
        category: "pants",
        image: "../static/images/product-12.jpg",
      },
    ];
  }
}
// DOM Elements
const productsGrid = document.getElementById("ProductFlex");
const pagination = document.querySelector("#pagination");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");

const productsPerPage = 8;
let currentPage = 1;

//fill cat dynamically 
function populateCategoryFilter(comingProducts) {
  const dynCatagories = [...new Set(comingProducts.map((pro) => pro.category))];
  categoryFilter.innerHTML = '<option value="">All Categories</option>'; // Reset options
  dynCatagories.forEach(dcat => {
    const option = document.createElement("option");
    option.value = dcat;
    option.textContent = dcat.charAt(0).toUpperCase() + dcat.slice(1);
    categoryFilter.appendChild(option);
  });
}

function setupEventListeners() {
  // Search input
  searchInput.addEventListener("input", () => {
    applyFiltersAndSort();
  });

  // Category filter
  categoryFilter.addEventListener("change", () => {
    applyFiltersAndSort();
  });

  // Sort filter
  sortFilter.addEventListener("change", () => {
    applyFiltersAndSort();
  });
}

// Apply filters and sort
function applyFiltersAndSort() {
  let filtered = [...sampleProducts];
  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value.toLowerCase();
  const sortOption = sortFilter.value;

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Apply category filter
  if (category) {
    filtered = filtered.filter((product) => product.category == category);
  }

  // Apply sorting
  switch (sortOption) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      filtered.sort((a, b) => a.id - b.id);
  }

  filteredProducts = filtered;
  console.log(`found filtered products  ${filteredProducts}`);
  currentPage = 1;
  renderProducts();
}

window.addToCart = function (productId) {
  const product = sampleProducts.find((p) => p.id == productId);
  if (product) {
    const existingItem = cart.find((item) => item.id == productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification("Product added to cart!");
  }
};

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Render products for current page
function renderProducts() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  console.log(`current products ${currentProducts}`);

  productsGrid.innerHTML = "";

  currentProducts.forEach((product) => {
    const productHTML = `
                <div class="col-4">
                <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-o"></i>
                </div>
                <div class="product-details">
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${
                  product.id
                })">
                <i class="fa fa-shopping-cart"></i> Add to Cart
                </button>
                </div>
                </div>
                </div>
                `;
    productsGrid.insertAdjacentHTML("beforeend", productHTML);
    //kareem=> safer because it directly inserts parsed HTML into the DOM, avoiding script execution risks associated with innerHTML
  });

  renderPagination();
}

function renderPagination() {
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const maxVisibleButtons = 5;
  const pageNumbers = document.getElementById("pageNumbers");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  // Enable/disable prev/next buttons
  prevBtn.disabled = currentPage == 1;
  nextBtn.disabled = currentPage == pageCount;

  //-- Calculate visible page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2)); //to go back 2 pages
  let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1); //to limit display 5 btns only(maxVisibleButtons)

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  // Clear existing page numbers
  pageNumbers.innerHTML = "";

  // if start page (current-2)
  if (startPage > 1) {
    addPageButton(1);
    if (startPage > 2) {
      addEllipsis();
    }
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    addPageButton(i);
  }

  // Add last page if not in range
  if (endPage < pageCount) {
    if (endPage < pageCount - 1) {
      addEllipsis();
    }
    addPageButton(pageCount);
  }

  // Update active state
  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.textContent) === currentPage);
  });

  function addPageButton(pageNum) {
    const button = document.createElement("button");
    button.className = `page-btn ${pageNum == currentPage ? "active" : ""}`;
    button.textContent = pageNum;
    button.onclick = () => changePage(pageNum);
    pageNumbers.appendChild(button);
  }

  function addEllipsis() {
    const span = document.createElement("span");
    span.className = "ellipsis";
    span.textContent = "...";
    pageNumbers.appendChild(span);
  }

  // Change page
  function changePage(page) {
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
    if (page >= 1 && page <= pageCount) {
      currentPage = page;
      renderProducts();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // Add event listeners for prev/next buttons
  prevBtn.onclick = () => changePage(currentPage - 1);
  nextBtn.onclick = () => changePage(currentPage + 1);
}

// Initialize ::DOMContentLoaded=> fires before external resources
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  sampleProducts = await fetchProducts();
  filteredProducts = [...sampleProducts];
  populateCategoryFilter(filteredProducts);
  renderProducts();
  applyFiltersAndSort();

  window.updateCartCount();
});
