const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addNewSkill, getSkills } = require('../controllers/skillsController');
const router = express.Router();

router.post("/", verifyAuthentication, addNewSkill);
router.get("/", verifyAuthentication, getSkills);

module.exports = router;