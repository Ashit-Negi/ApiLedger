module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // safety: user/role missing
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // check role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
