const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    url: { type: String },
    userid: { tpye: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Resume = mongoose.model("resumes", resumeSchema);

module.exports = Resume;