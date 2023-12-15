const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connect };