const express = require('express');
const { getIndustrytypeFilter, getCategoryFilter, getJobroleFilter } = require('../controllers/filterController');
const router = express.Router();

router.get("/industrytypes", getIndustrytypeFilter);
router.get("/categories", getCategoryFilter);
router.get("/jobroles", getJobroleFilter);

module.exports = router;