const express = require('express');
const { createProduct } = require('../controller/product.controller');
const router = express.Router();

router.post('/create', createProduct);

module.exports = router;