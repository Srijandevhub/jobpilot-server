const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Company = require('../models/companyModel');

const addApplication = async (req, res) => {
    try {
        const user = req.user;
        const { jobid, resumelink, coverletter } = req.body;
        const applicationExists = await Application.findOne({ jobid: jobid });
        if (applicationExists) {
            return res.status(400).json({ message: "Already applied" });
        }
        const newApplication = new Application({
            jobid,
            userid: user._id,
            resumelink,
            coverletter
        });
        await newApplication.save();
        await User.findByIdAndUpdate(user._id, {
            $push: { appliedjobids: jobid }
        });
        res.status(200).json({ message: "Application submitted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateApplication = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'application') {
            return res.status(400).json({ message: "Access Denied: not allowed to update application" });
        }
        const { id } = req.params;
        const { status } = req.body;
        const updatedApplication = await Application.findByIdAndUpdate(id, {
            status
        }, { new: true });
        res.status(200).json({ message: "Updated successful!", application: updatedApplication });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getApplications = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access Denied: not allowed to get applications" });
        }
        const { id } = req.params;
        if (user.role === 'recruiter') {
            const jobPosted = await Job.findById(id);
            if (jobPosted.postedby.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
            }
        } else if (user.role === 'company_admin') {
            const jobPosted = await Job.findById(id);
            if (jobPosted.companyid.toString() !== user.companyid.toString()) {
                return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
            } 
        }
        const applications = await Application.find({ jobid: id }).sort({ createdAt: -1 });
        const userids = applications.map(item => item.userid);
        const users = await User.find({ _id: { $in: userids } });
        const allApplication = applications.map((item) => {
            const userid = item.userid;
            const user = users.find(item => item._id.toString() === userid.toString());
            return {
                _id: item._id,
                applicant: user.fullname,
            }
        })
        res.status(200).json({ message: "Fetched applications", applications: allApplication });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getMyApplications = async (req, res) => {
    try {
        const user = req.user;
        const userDB = await User.findById(user._id).lean();
        const applications = await Application.find({ _id: { $in: userDB.appliedjobids } }).lean();
        const jobids = applications.map(item => item.jobid);
        const jobs = await Job.find({ _id: { $in: jobids } }).lean();
        const companyids = [
            ...new Set(
                jobs.map(item => item.companyid).filter(Boolean)
            )
        ];
        const companies = await Company.find({ _id: { $in: companyids } }).lean();
        const allApplications = applications.map((item) => {
            const job = jobs.find(job => job._id.toString() === item.jobid.toString());
            const company = companies.find(company => company._id.toString() === job.companyid.toString());
            return {
                _id: item._id,
                resumelink: item.resumelink,
                coverletter: item.coverletter,
                status: item.status,
                jobtitle: job.title,
                companyname: company.name
            }
        });
        res.status(200).json({ message: "Applications fetched", applications: allApplications })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addApplication, updateApplication, getApplications, getMyApplications };
