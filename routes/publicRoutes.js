const express = require('express');
const { getCategoriesPublic, getJobsPublic, getJobrolesPublic, getJobPublic } = require('../controllers/publicControllers');
const router = express.Router();

router.get("/categories", getCategoriesPublic);
router.get("/jobs", getJobsPublic);
router.get("/jobroles", getJobrolesPublic);
router.get("/job/:id", getJobPublic);

module.exports = router;