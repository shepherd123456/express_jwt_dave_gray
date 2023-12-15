const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  const foundUser = await User.findOne({ username }).exec();
  const roles = foundUser.roles;
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      {
        /* AUTHENTICATION */ username,
        /* AUTHORIZATION */ roles
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { loginUser };