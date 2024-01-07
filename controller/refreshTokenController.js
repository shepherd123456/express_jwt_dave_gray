const jwt = require('jsonwebtoken');

const User = require('../model/User');

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    // maxAge: 24 * 60 * 60 * 1000 // not needed
  });

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    // detected refresh token reuse
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefreshToken) => {
      if (err) return res.sendStatus(401);
      console.log('attempted refresh token reuse!');
      const hackedUser = await User.findOne({ username: decodedRefreshToken.context.username }).exec();
      hackedUser.refreshToken = []; // delete all refreshTokens from user compromised with expired refreshToken
      const result = await hackedUser.save();
      console.log(result);
    });
    return res.sendStatus(401);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefreshToken) => {

    if (err || foundUser.username !== decodedRefreshToken.context.username) {
      console.log('expired refresh token');
      foundUser.refreshToken = newRefreshTokenArray;
      const result = await foundUser.save();
      console.log(result);
      return res.sendStatus(401);
    }
    const accessToken = jwt.sign(
      {
        context: {
        /* AUTHENTICATION */ username: decodedRefreshToken.context.username,
        /* AUTHORIZATION */ roles: foundUser.roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    )
    const newRefreshToken = jwt.sign(
      { context: { username: foundUser.username } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.send(accessToken);
  });
}

module.exports = { refresh }