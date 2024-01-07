const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

async function loginUser(req, res) {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);
  const foundUser = await User.findOne({ username }).exec();
  const roles = foundUser.roles;
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      {
        context: {
        /* AUTHENTICATION */ username,
        /* AUTHORIZATION */ roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    const newRefreshToken = jwt.sign(
      { context: { username } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    const newRefreshTokenArray =
      !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rf => rf !== cookies.jwt);
    if (cookies?.jwt) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        // maxAge: 24 * 60 * 60 * 1000 // not needed
      });
    }
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.send(accessToken);
  } else {
    res.sendStatus(401);
  }
}

module.exports = { loginUser };