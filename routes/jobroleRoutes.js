const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addJobrole, getJobRoles } = require('../controllers/jobroleControllers');
const router = express.Router();

router.post("/", verifyAuthentication, addJobrole);
router.get("/", verifyAuthentication, getJobRoles);


module.exports = router;