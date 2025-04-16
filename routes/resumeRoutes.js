const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { addResumes, getResumes, deleteResume } = require('../controllers/resumeControllers');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post("/", verifyAuthentication, upload.array('resumes', 10), addResumes);
router.get("/", verifyAuthentication, getResumes);
router.delete("/:id", verifyAuthentication, deleteResume);

module.exports = router;