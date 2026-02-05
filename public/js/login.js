const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

function show(text, ok=false){
  msg.innerHTML = `<div class="alert ${ok ? "alert-success" : "alert-danger"}">${text}</div>`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return show(data.message || "Invalid credentials");
    }

    show("Logged succesfully", true);

    setTimeout(() => {
      window.location.href = "/admin";
    }, 400);

  } catch (err) {
    show("Network error");
  }
});