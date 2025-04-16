const mongoose = require('mongoose');

const sociallinkSchema = new mongoose.Schema({
    name: { type: String, default: "linkedin" },
    link: { type: String, default: "" },
    userid: { tpye: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Sociallink = mongoose.model("sociallinks", sociallinkSchema);

module.exports = Sociallink;