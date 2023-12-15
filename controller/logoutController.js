const jwt = require('jsonwebtoken');

const User = require('../model/User');

async function logout(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  if (!foundUser) {
    return res.sendStatus(204);
  }
  foundUser.refreshToken = '';
  await foundUser.save();
  return res.sendStatus(204);
}

module.exports = { logout }