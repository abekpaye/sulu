document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");
  const totalBox = document.getElementById("cart-total");
  const purchaseBtn = document.querySelector(".purchase-btn");

  let cart = [];

  async function loadCart() {
    try {
      const res = await fetch("/api/orders/cart");

      if (res.status === 401) {
        cart = [];
        renderCart();
        return;
      }

      const data = await res.json();
      cart = data.items || [];
      renderCart();
    } catch (err) {
      console.error(err);
    }
  }

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML =
        "<p style='text-align:center; color:#666;'>Your cart is empty.</p>";
    }

    cart.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h2>${item.title}</h2>
          <p>Price: ${item.price} tg</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <button class="remove-btn" data-id="${item.productId}">
          Remove
        </button>
      `;

      cartContainer.appendChild(itemDiv);
      total += item.price * item.quantity;
    });

    totalBox.textContent = `Total: ${total} tg`;

    // REMOVE
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const productId = button.dataset.id;

        await fetch(`/api/orders/cart/remove/${productId}`, {
          method: "DELETE"
        });

        loadCart();
      });
    });
  }

  loadCart();
});
