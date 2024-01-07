const bcrypt = require('bcrypt');

const User = require('../model/User');

async function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { registerUser }