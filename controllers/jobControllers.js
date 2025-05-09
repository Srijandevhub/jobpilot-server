const Job = require('../models/jobModel');

const addJob = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: Add job not allowed" });
        }
        const { title, jobtype, jobdescription, minsalary, maxsalary, city, country, jobexpiry, joblevel, minexperience, maxexperience, education, categoryid, jobroleid, skillids } = req.body;
        const newJob = new Job({
            title, jobtype, jobdescription, minsalary, maxsalary, jobexpiry, joblevel, minexperience, maxexperience, education, companyid: user.companyid, postedby: user._id, categoryid, jobroleid, location: { city, country }, skillids: JSON.parse(skillids)
        });
        await newJob.save();
        res.status(200).json({ message: "Job Added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobs = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: Get jobs not allowed" });
        }
        let jobs;
        if (user.role === 'super_admin') {
            jobs = await Job.find().sort({ createdAt: -1 });
        } else if (user.role === 'company_admin') {
            jobs = await Job.find({ companyid: user.companyid }).sort({ createdAt: -1 });
        } else if (user.role === 'recruiter') {
            jobs = await Job.find({ companyid: user.companyid, postedby: user._id }).sort({ createdAt: -1 });
        }
        res.status(200).json({ message: "Jobs fetched", jobs: jobs });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addJob, getJobs };