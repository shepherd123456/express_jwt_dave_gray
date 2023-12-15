function verifyRoles(...allowedRoles) {
  return function (req, res, next) {
    const roles = req.roles;
    if (!roles) return res.sendStatus(401);
    const isAllowed = Object.keys(roles).some(role => allowedRoles.includes(role));
    if (!isAllowed) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles;