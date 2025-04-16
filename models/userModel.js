const mongoose = require('mongoose');

// const experienceSchema = new mongoose.Schema({
//     companyname: { type: String, required: true },
//     jobtitle: { type: String, required: true },
//     startdate: { type: Date, required: true },
//     enddate: { type: Date, required: true },
//     current: { type: Boolean, default: false },
//     location: { type: String },
//     description: { type: String }
// }, { timestamps: true });
// const educationSchema = new mongoose.Schema({
//     institutename: { type: String, required: true },
//     degree: { type: String, required: true },
//     startdate: { type: Date, required: true },
//     enddate: { type: Date, required: true },
//     current: { type: Boolean, default: false },
//     marks: { type: String },
//     description: { type: String }
// }, { timestamps: true });
// const resume = new mongoose.Schema({
//     url: { type: String }
// }, { timestamps: true });
// const sociallinkSchema = new mongoose.Schema({
//     name: { type: String, default: "linkedin" },
//     link: { type: String, default: "" }
// }, { timestamps: true });

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phonecode: { type: String, default: "" },
    phonenumber: { type: String, default: "", match: /^[0-9]{6,15}$/ },
    password: { type: String, required: true },
    profilepicture: { type: String, default: "" },
    title: { type: String, default: "" },
    experienceids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'experiences' }],
    educationids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'educations' }],
    personalwebsite: { type: String, default: "" },
    resumeids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resumes' }],
    nationality: { type: String, default: "" },
    dateofbirth: { type: String, default: "" },
    gender: { type: String, default: "none", enum: ["none", "male", "female"] },
    maritalstatus: { type: String, default: "none", enum: ["none", "married", 'single'] },
    biography: { type: String, default: "" },
    sociallinkids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sociallinks' }],
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    skillids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'skills' }],
    languages: [{
        name: { type: String },
        proficiency: { type: String, enum: ["Basic", "Conversational", "Fluent", "Native"] }
    }],
    role: { type: String, enum: ["super_admin", "company_admin", "recruiter", "applicant"], default: 'applicant' },
    savedjobids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'jobs' }],
    appliedjobids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'jobs' }],
    refreshtoken: { type: String, default: "" },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
    companyid: { type: mongoose.Schema.Types.ObjectId, ref: 'companies', default: null }
}, { timestamps: true })

const User = mongoose.model('users', userSchema);

module.exports = User;