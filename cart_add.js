document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  restoreCartState();

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => handleAddToCart(button));
  });

  function handleAddToCart(button) {
    const productCard = button.closest(".product-card");
    const title = productCard.querySelector(".product-title").textContent;
    const price = productCard.querySelector(".product-price").textContent;
    const image = productCard.querySelector(".product-image").src;
    const size = productCard.querySelector(".size-select").value;

    const product = { title, price, image, size, quantity: 1 };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      item => item.title === product.title && item.size === product.size
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById("cart-count");
    countEl.textContent = totalCount;
  }

  function restoreCartState() {
    updateCartCount();
  }
});