const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controller/refreshTokenController');

router.get('/', refreshTokenController.refresh);

module.exports = router;