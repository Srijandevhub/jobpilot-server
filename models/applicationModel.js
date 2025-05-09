const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobid: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs' },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    resumelink: { type: String, required: true },
    coverletter: { type: String, required: true },
    status: { type: String, enum: ['applied', 'under_review', 'rejected', 'accepted'], default: 'applied' },
    matchedskills: { type: Number, default: 0 }
}, { timestamps: true });

const Application = mongoose.model("applications", applicationSchema);

module.exports = Application;