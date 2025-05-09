const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addApplication, updateApplication, getApplications, getMyApplications, getApplication } = require('../controllers/applicationControllers');
const router = express.Router();

router.post("/", verifyAuthentication, addApplication);
router.put("/:id", verifyAuthentication, updateApplication);
router.get("/myapplications", verifyAuthentication, getMyApplications);
router.get("/:id", verifyAuthentication, getApplications);
router.get("/getapplication/:id", verifyAuthentication, getApplication);

module.exports = router;
