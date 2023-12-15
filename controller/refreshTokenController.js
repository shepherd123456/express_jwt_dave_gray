const jwt = require('jsonwebtoken');

const User = require('../model/User');

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  const username = foundUser.username;
  const roles = foundUser.roles;
  if (!foundUser) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedRefreshToken) => {
    if (err || username !== decodedRefreshToken.username) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      {
        /* AUTHENTICATION */ username,
        /* AUTHORIZATION */ roles
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )
    res.json({ accessToken });
  });
}

module.exports = { refresh }