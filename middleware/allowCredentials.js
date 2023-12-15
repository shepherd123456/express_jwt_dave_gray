const whiteList = require('../config/whiteList');

function allowCredentials(req, res, next) {
  const origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = allowCredentials;