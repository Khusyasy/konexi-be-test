const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to the API', goto: '/api/v1' });
});

module.exports = router;
