const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    companyname: { type: String, required: true },
    jobtitle: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    current: { type: Boolean, default: false },
    location: { type: String },
    description: { type: String },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Experience = mongoose.model("experiences", experienceSchema);

module.exports = Experience;