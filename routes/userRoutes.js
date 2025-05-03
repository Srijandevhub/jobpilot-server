const express = require('express');
const { register, login, protected, logout, updateMyProfile, updateProfileImage, addUser, getUsers, fetchResumes } = require('../controllers/userControllers');
const { verifyAuthentication } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", verifyAuthentication, protected);
router.post("/logout", logout);
router.post("/updatemyprofile", verifyAuthentication, updateMyProfile);
router.post("/updateprofileimage", verifyAuthentication, upload.single("imgfile"), updateProfileImage);

router.post("/adduser", verifyAuthentication, addUser);
router.get("/allusers", verifyAuthentication, getUsers);

router.get("/resumes", verifyAuthentication, fetchResumes);

module.exports = router;
