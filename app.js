require('dotenv').config();
require('./config/mongo.js').connect();

const mongoose = require('mongoose');
const path = require('path')
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


const { logger } = require('./middleware/logEvents');
const allowCredentials = require('./middleware/allowCredentials.js');
const corsOption = require('./config/corsOption.js');
const errorHandler = require('./middleware/errorHandler');
const verifyJwt = require('./middleware/verifyJwt.js');

const PORT = process.env.PORT | 3500;

app.use(logger);
app.use(allowCredentials);
app.use(cors(corsOption)); // Cross Origin Resource Sharing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./route/root.js'));
app.use('/register', require('./route/register'));
app.use('/login', require('./route/login'));
app.use('/refresh', require('./route/refresh'));
app.use('/logout', require('./route/logout.js'));
app.use(verifyJwt);
app.use('/users', require('./route/api/users'));
app.use('/employees', require('./route/api/employees'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'view', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 not found' });
  } else {
    res.type('type').send('404 not found');
  }
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to mongodb');
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});