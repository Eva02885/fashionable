
const productsContainer = document.getElementById("products-container");
const categoryFilter = document.getElementById("category-filter");
const viewAllButton = document.getElementById("view-all");
const productStatus = document.getElementById("product-status");
const productSearch = document.getElementById("product-search");

const API_URL = "https://dummyjson.com/products";
let showAllProducts = false;
let searchTimeout;

async function fetchProducts(url = `${API_URL}?limit=0`) {
    productsContainer.innerHTML = "";
    productStatus.textContent = "Loading products...";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log(data);

        const productsToDisplay = showAllProducts
            ? data.products: data.products.slice(0, 16);

        displayProducts(productsToDisplay);
    } catch (error) {
        console.error(error);
        productStatus.textContent = "Unable to load products. Please try again.";
    }
}

function displayProducts(products) {
    productsContainer.innerHTML = "";

    if (!products || products.length === 0) {
        productStatus.textContent = "No products found.";
        return;
    }

    productStatus.textContent = "";

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" type="button">Add to Cart</button>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/category-list`);

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Unable to load categories:", error);
    }
}

categoryFilter.addEventListener("change", () => {
    showAllProducts = false;

    const category = categoryFilter.value;

    if (category) {
        fetchProducts(`${API_URL}/category/${encodeURIComponent(category)}?limit=0`);
    } else {
        fetchProducts();
    }
});

viewAllButton.addEventListener("click", () => {
    showAllProducts = true;
    categoryFilter.value = "";
    productSearch.value = "";
    fetchProducts();
});

productSearch.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const query = productSearch.value.trim();
        showAllProducts = false;

        if (query) {
            categoryFilter.value = "";
            fetchProducts(`${API_URL}/search?q=${encodeURIComponent(query)}&limit=0`);
        } else {
            fetchProducts();
        }
    }, 300);
});

fetchCategories();
fetchProducts();

