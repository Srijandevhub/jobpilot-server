const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addJob, getJobs } = require('../controllers/jobControllers');
const router = express.Router();

router.post("/", verifyAuthentication, addJob);
router.get("/", verifyAuthentication, getJobs);

module.exports = router;