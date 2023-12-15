const User = require('../model/User');

async function getAllUser(req, res) {
  const users = await User.find();
  if (users.length === 0) return res.json({ message: 'no users found' });
  res.json(users);
}

async function getUser(req, res) {
  const _id = req.params.id;
  const user = await User.findOne({ _id }).exec();
  if (!user) return res.sendStatus(404);
  res.json(user);
}

async function deleteUser(req, res) {
  const _id = req.params.id;
  const user = await User.findOne({ _id }).exec();
  if (!user) return res.sendStatus(404);
  await user.deleteOne();
  res.sendStatus(204);
}

module.exports = {
  getAllUser,
  getUser,
  deleteUser
}