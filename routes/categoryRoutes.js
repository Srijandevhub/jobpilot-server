const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addCategory, getCategories } = require('../controllers/categoryControllers');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post("/", verifyAuthentication, upload.single("icon"), addCategory);
router.get("/", verifyAuthentication, getCategories);

module.exports = router;