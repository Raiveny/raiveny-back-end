const express = require('express');

const error = require('../error');

const route2 = require('./route2');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'hello Rout 1'
  });
});

router.use('/route2', route2);

router.use(error.notFound);
router.use(error.errorHandler);

module.exports = router;
