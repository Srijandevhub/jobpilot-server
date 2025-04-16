const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    institutename: { type: String, required: true },
    degree: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    current: { type: Boolean, default: false },
    marks: { type: String },
    description: { type: String },
    userid: { tpye: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Education = mongoose.model("educations", educationSchema);

module.exports = Education;