const express = require('express');
const { verifyAuthentication } = require('../middlewares/auth');
const { getMessages } = require('../controllers/chatControllers');
const router = express.Router();

router.get("/:chatroomid", verifyAuthentication, getMessages);

module.exports = router;