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

    showQuantityButtons(button, productCard, product);
  }

  function showQuantityButtons(addButton, card, product) {
    const existingControls = card.querySelector(".quantity-controls");
    if (existingControls) existingControls.remove();

    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity-controls");

    quantityContainer.innerHTML = `
      <button class="quantity-btn minus">−</button>
      <span class="quantity-number">${product.quantity}</span>
      <button class="quantity-btn plus">+</button>
    `;

    addButton.replaceWith(quantityContainer);

    const minusBtn = quantityContainer.querySelector(".minus");
    const plusBtn = quantityContainer.querySelector(".plus");
    const quantityNumber = quantityContainer.querySelector(".quantity-number");

    let currentQuantity = product.quantity;

    plusBtn.addEventListener("click", () => {
      currentQuantity++;
      quantityNumber.textContent = currentQuantity;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = cart.find(
        item => item.title === product.title && item.size === product.size
      );
      if (existingProduct) {
        existingProduct.quantity = currentQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });

    minusBtn.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityNumber.textContent = currentQuantity;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(
          item => item.title === product.title && item.size === product.size
        );
        if (existingProduct) {
          existingProduct.quantity = currentQuantity;
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(
          item => !(item.title === product.title && item.size === product.size)
        );
        localStorage.setItem("cart", JSON.stringify(cart));

        const newAddButton = document.createElement("button");
        newAddButton.classList.add("add-to-cart-btn");
        newAddButton.textContent = "Add to Cart";
        quantityContainer.replaceWith(newAddButton);

        newAddButton.addEventListener("click", () => handleAddToCart(newAddButton));
      }
    });

    const sizeSelect = card.querySelector(".size-select");
    if (sizeSelect) {
      sizeSelect.addEventListener("change", () => {
        const newAddButton = document.createElement("button");
        newAddButton.classList.add("add-to-cart-btn");
        newAddButton.textContent = "Add to Cart";
        quantityContainer.replaceWith(newAddButton);

        newAddButton.addEventListener("click", () => handleAddToCart(newAddButton));
      }, { once: true });
    }
  }

  function restoreCartState() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(product => {
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach(card => {
        const title = card.querySelector(".product-title").textContent;
        const sizeSelect = card.querySelector(".size-select");

        if (title === product.title && sizeSelect.value === product.size) {
          const addButton = card.querySelector(".add-to-cart-btn");
          if (addButton) showQuantityButtons(addButton, card, product);
        }
      });
    });
  }
});