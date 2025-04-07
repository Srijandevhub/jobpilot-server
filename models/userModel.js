const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    companyname: { type: String, required: true },
    jobtitle: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    current: { type: Boolean, default: false },
    location: { type: String },
    description: { type: String }
}, { timestamps: true });
const educationSchema = new mongoose.Schema({
    institutename: { type: String, required: true },
    degree: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    current: { type: Boolean, default: false },
    marks: { type: String },
    description: { type: String }
}, { timestamps: true });
const resume = new mongoose.Schema({
    url: { type: String }
}, { timestamps: true });
const sociallinkSchema = new mongoose.Schema({
    name: { type: String, default: "linkedin" },
    link: { type: String, default: "" }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phonecode: { type: String, default: "" },
    phonenumber: { type: String, default: "", match: /^[0-9]{6,15}$/ },
    password: { type: String, required: true, select: false },
    profilepicture: { type: String, default: "" },
    title: { type: String, default: "" },
    experiences: [experienceSchema],
    educations: [educationSchema],
    personalwebsite: { type: String, default: "" },
    resumes: [resume],
    nationality: { type: String, default: "" },
    dateofbirth: { type: Date, default: "" },
    gender: { type: String, default: "" },
    maritalstatus: { type: String, default: "" },
    biography: { type: String, default: "" },
    sociallinks: [sociallinkSchema],
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'skills' }],
    languages: [{
        name: { type: String },
        proficiency: { type: String, enum: ["Basic", "Conversational", "Fluent", "Native"] }
    }],
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        credentialUrl: { type: String }
    }],
    projects: [{
        title: { type: String },
        description: { type: String },
        link: { type: String },
        technologies: [String]
    }],
    jobpreferences: {
        preferredLocations: [String],
        jobTypes: [String],
        expectedSalary: { type: String },
        noticePeriod: { type: String }
    },
    role: { type: String, enum: ["super_admin", "company_admin", "recruiter", "applicant"], default: 'applicant' },
    refreshtoken: { type: String, default: "" }
}, { timestamps: true })

const User = mongoose.model('users', userSchema);

module.exports = User;