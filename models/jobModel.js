const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, require: true, index: 1 },
    companyid: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    jobetype: { type: String, enum: ["full-time", "part-time", "internship"], default: "full-time" },
    jobdescription: { type: String, required: true },
    salary: { type: String, default: "" },
    location: {
        city: { type: String },
        country: { type: String }
    },
    jobexpiry: { type: Date, required: true },
    joblevel: { type: String, required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    isarchieved: { type: Boolean, default: false },
}, { timestamps: true });

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;