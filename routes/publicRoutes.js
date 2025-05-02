const express = require('express');
const { getCategoriesPublic, getJobsPublic, getJobrolesPublic, getJobPublic, getCompaniesPublic, getCompanyPublic } = require('../controllers/publicControllers');
const router = express.Router();

router.get("/categories", getCategoriesPublic);
router.get("/jobs", getJobsPublic);
router.get("/jobroles", getJobrolesPublic);
router.get("/job/:id", getJobPublic);
router.get("/companies", getCompaniesPublic);
router.get("/company/:id", getCompanyPublic);

module.exports = router;
