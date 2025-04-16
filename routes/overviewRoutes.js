const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { getCounts } = require('../controllers/overviewControllers');
const router = express.Router();

router.get("/", verifyAuthentication, getCounts);

module.exports = router;