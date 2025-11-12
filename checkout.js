document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const form = document.getElementById("checkout-form");
  const totalEl = document.getElementById("total-price");
  const deliveryEl = document.getElementById("delivery-price");
  const fullEl = document.getElementById("full-price");
  const modal = document.getElementById("success-modal");

  const DELIVERY_COST = 1000;
  const total = cart.reduce(
    (sum, item) => sum + parseInt(item.price.replace("tg", "")) * item.quantity,
    0
  );
  const full = total + DELIVERY_COST;

  totalEl.textContent = `${total} tg`;
  deliveryEl.textContent = `${DELIVERY_COST} tg`;
  fullEl.textContent = `${full} tg`;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const trackingCode = "TRK" + Math.floor(Math.random() * 1000000);

    const emailItems = cart.map(item => ({
      title: item.title,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));

    const emailData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      items: emailItems,
      total: `${total} tg`,
      delivery: `${DELIVERY_COST} tg`,
      fullPrice: `${full} tg`,
      trackingCode: trackingCode
    };

    try {
      await emailjs.send(
        "service_qg0ofla",
        "template_c2mcl1g",
        emailData
      );

      localStorage.removeItem("cart");
      form.reset();
      form.style.display = "none";
      modal.style.display = "block";

    } catch (err) {
      alert("⚠️ Something went wrong while sending your order. Please try again.");
    }
  });
});
