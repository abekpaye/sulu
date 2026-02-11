function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};