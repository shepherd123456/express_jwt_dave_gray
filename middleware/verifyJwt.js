const jwt = require('jsonwebtoken');

function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const accessToken = authHeader.split(' ')[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedAccessToken) => {
    if (err) return res.sendStatus(403);
    req.user = decodedAccessToken.username;
    req.roles = decodedAccessToken.roles;
    next();
  });
}

module.exports = verifyJwt;