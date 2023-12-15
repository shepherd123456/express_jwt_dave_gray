const { format } = require('date-fns');
const { v4 } = require('uuid');

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

async function logEvents(message, logName) {
  const datetime = `${format(new Date, "yyyy-MM-dd'T'HH:mm:ss")}`;
  const logItem = `[${datetime};${v4()}]: ${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
}

function logger(req, res, next) {
  logEvents(`${req.method} ${req.headers.origin} ${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = { logger, logEvents }