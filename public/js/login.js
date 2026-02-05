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

    setTimeout(async () => {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();

      if (me.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    }, 400);


  } catch (err) {
    show("Network error");
  }
});