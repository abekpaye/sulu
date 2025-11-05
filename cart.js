document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");
  const totalBox = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p style='text-align:center; color:#666;'>Your cart is empty.</p>";
      totalBox.textContent = "Total: 0 tg";
      return;
    }

    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h2>${item.title}</h2>
          <p>Size: ${item.size}</p>
          <p>Price: ${item.price}</p>
          <p class="quantity">Quantity: ${item.quantity}</p>
        </div>
        <div class="item-actions">
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;

      cartContainer.appendChild(itemDiv);

      total += parseInt(item.price.replace("tg", "")) * item.quantity;
    });

    totalBox.textContent = `Total: ${total} tg`;

    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", e => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
