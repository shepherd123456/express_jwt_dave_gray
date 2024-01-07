const mongoose = require('mongoose');

const ROLES_MAP = require('../config/rolesMap');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // roles: {
  //   type: Object,
  //   validate: obj => {
  //     let allowedKeys = Object.keys(ROLES_MAP);
  //     // all keys are inside "allowedKeys"
  //     let correctKeys = Object.keys(obj).every(key => allowedKeys.includes(key));
  //     // all values are same as its keys
  //     let correctValues = Object.keys(obj).every(key => obj[key] === key);
  //     return correctKeys && correctValues;
  //   },
  //   default: { USER: 'USER' }
  // },
  roles: {
    type: [String],
    default: ['USER']
  },
  refreshToken: [String]
});

module.exports = mongoose.model('User', userSchema)