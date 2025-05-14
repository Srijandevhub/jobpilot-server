const Chat = require('../models/chatModel');
const getMessages = async (req, res) => {
    try {
        const user = req.user;
        const { chatroomid } = req.params;
        const messages = await Chat.find({ chatroomid, $or: [{ sender: user._id }, { receiver: user._id }] }).sort({ createdAt: 1 });
        res.status(200).json({ message: "Messages fetched", messages: messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { getMessages };