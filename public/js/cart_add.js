document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("add-to-cart")) return;

  const productId = e.target.dataset.id;

  try {
    const res = await fetch("/api/orders/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })
    });

    if (res.status === 401) {
      alert("Please log in first.");
      return;
    }

    if (!res.ok) {
      alert("Failed to add to cart.");
      return;
    }

    updateCartCount();

  } catch (err) {
    console.error(err);
  }
});


async function updateCartCount() {
  try {
    const res = await fetch("/api/orders/cart");

    if (!res.ok) return;

    const data = await res.json();
    const cart = data.items || [];

    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById("cart-count");

    if (el) el.textContent = total;

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
