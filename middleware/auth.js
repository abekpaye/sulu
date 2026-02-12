const path = require("path");

function isAuthenticated(req, res, next) {
  if (!req.session?.userId) {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.redirect("/login");
  }

  next();
}

function isAdmin(req, res, next) {
  if (!req.session?.userId) {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.redirect("/login");
  }

  if (req.session.role !== "admin") {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res
      .status(403)
      .sendFile(path.join(__dirname, "../views/403.html"));
  }

  next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};
