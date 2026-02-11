document.addEventListener("DOMContentLoaded", async () => {
  const authLink = document.getElementById("auth-link");
  if (!authLink) return;

  try {
    const res = await fetch("/api/auth/me");

    if (!res.ok) {
      authLink.textContent = "Sign in";
      authLink.href = "/login";
      return;
    }

    // user logged in
    authLink.textContent = "Log out";
    authLink.href = "#";

    authLink.addEventListener("click", async (e) => {
      e.preventDefault();

      await fetch("/logout", { method: "POST" });

      window.location.href = "/";
    });

  } catch (err) {
    authLink.textContent = "Sign in";
    authLink.href = "/login";
  }
});
