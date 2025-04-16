const express = require('express');
const { addIndustryType, getIndustryTypes } = require('../controllers/industrytypeControllers');
const { verifyAuthentication } = require('../middlewares/auth');
const router = express.Router();

router.post("/", verifyAuthentication, addIndustryType);
router.get("/", verifyAuthentication, getIndustryTypes);

module.exports = router;