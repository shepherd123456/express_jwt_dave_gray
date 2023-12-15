const bcrypt = require('bcrypt');

const User = require('../model/User');

async function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ success: `new user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { registerUser }