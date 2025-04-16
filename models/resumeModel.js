const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    url: { type: String },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    publicid: { type: String }
}, { timestamps: true });

const Resume = mongoose.model("resumes", resumeSchema);

module.exports = Resume;