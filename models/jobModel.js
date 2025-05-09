const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, require: true, index: 1 },
    companyid: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    jobtype: { type: String, enum: ["full-time", "part-time", "internship"], default: "full-time" },
    jobdescription: { type: String, required: true },
    minsalary: { type: String, default: "" },
    maxsalary: { type: String, default: "" },
    location: {
        city: { type: String, index: 1 },
        country: { type: String, index: 1 }
    },
    jobexpiry: { type: Date, required: true },
    joblevel: { type: String, required: true },
    minexperience: { type: Number, required: true },
    maxexperience: { type: Number, required: true },
    education: { type: String, required: true },
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    isarchieved: { type: Boolean, default: false },
    jobroleid: { type: mongoose.Schema.Types.ObjectId, ref: "jobroles" },
    categoryid: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    skillids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'skills' }]
}, { timestamps: true });

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
