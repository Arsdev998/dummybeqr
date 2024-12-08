const express = require('express');
const router = express.Router();
const { createMultipleQrCodes, verifyQRCode, getQRCodeHistory, getQrDwonload } = require('../controller/qrcode.controller');

router.post('/create', createMultipleQrCodes);
router.get('/history/:shopId', getQRCodeHistory);
router.get('/verify/:scanId', verifyQRCode);
router.get('/download/:batchId', getQrDwonload);

module.exports = router;