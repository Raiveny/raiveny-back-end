const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'hello Rout 2'
  });
});

module.exports = router;
