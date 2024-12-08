const express = require('express');
const { createShop } = require('../controller/shop.comtroller');
const router = express.Router();

router.post('/create', createShop);

module.exports = router;