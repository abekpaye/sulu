document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-to-cart")) return;

  const button = e.target;
  const productCard = button.closest(".product-card");

  const title = productCard.querySelector(".product-title").textContent;
  const price = productCard.querySelector(".product-price").textContent;
  const image = productCard.querySelector(".product-image")?.src || "";
  const size = productCard.querySelector(".size-select")?.value || null;

  const product = {
    id: button.dataset.id,
    title,
    price,
    image,
    size,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(
    item => item.id === product.id && item.size === product.size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
