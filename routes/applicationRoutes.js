const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addApplication, updateApplication } = require('../controllers/applicationControllers');
const router = express.Router();

router.post("/", verifyAuthentication, addApplication);
router.put("/", verifyAuthentication, updateApplication);

module.exports = router;