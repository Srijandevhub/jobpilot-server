const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: { type: String, required: true },
    chatroomid: { type: String, required: true }
}, { timestamps: true });

const Chat = mongoose.model('chats', chatSchema);
module.exports = Chat;