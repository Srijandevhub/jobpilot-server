const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addApplication, updateApplication, getApplications } = require('../controllers/applicationControllers');
const router = express.Router();

router.post("/", verifyAuthentication, addApplication);
router.put("/", verifyAuthentication, updateApplication);
router.get("/:id", verifyAuthentication, getApplications)

module.exports = router;
