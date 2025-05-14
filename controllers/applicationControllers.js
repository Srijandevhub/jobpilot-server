const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Company = require('../models/companyModel');

const addApplication = async (req, res) => {
    try {
        const user = req.user;
        const { jobid, resumelink, coverletter, matchedskills, recruiterid } = req.body;
        const applicationExists = await Application.findOne({ jobid: jobid });
        if (applicationExists) {
            return res.status(400).json({ message: "Already applied" });
        }
        const newApplication = new Application({
            jobid,
            userid: user._id,
            resumelink,
            coverletter,
            matchedskills: Number(matchedskills),
            recruiterid
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
        const jobPosted = await Job.findById(id).lean();

        if (user.role === 'recruiter') {
            if (jobPosted.postedby.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
            }
        }

        if (user.role === 'company_admin') {
            if (jobPosted.companyid.toString() !== user.companyid.toString()) {
                return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
            }
        }

        const applications = await Application.find({ jobid: id }).sort({ createdAt: -1 }).lean();

        const userids = applications.map(item => item.userid);
        const users = await User.find({ _id: { $in: userids } }).lean();

        const jobSkillIds = jobPosted.skillids.map(String);
        const totalRequiredSkills = jobSkillIds.length;

        const allApplication = applications.map((application) => {
            const applicant = users.find(u => u._id.toString() === application.userid.toString());

            const userSkillIds = applicant?.skillids?.map(String) || [];
            const matchedSkills = jobSkillIds.filter(skillId => userSkillIds.includes(skillId));
            const matchPercent = totalRequiredSkills > 0
                ? Math.round((matchedSkills.length / totalRequiredSkills) * 100)
                : 0;

            return {
                _id: application._id,
                applicant: applicant.fullname,
                userid: applicant._id,
                title: jobPosted.title,
                match: matchPercent
            };
        });

        res.status(200).json({ message: "Fetched applications", applications: allApplication });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


// const getApplications = async (req, res) => {
//     try {
//         const user = req.user;
//         if (user.role === 'applicant') {
//             return res.status(400).json({ message: "Access Denied: not allowed to get applications" });
//         }
//         const { id } = req.params;
//         const jobPosted = await Job.findById(id);
//         if (user.role === 'recruiter') {
//             if (jobPosted.postedby.toString() !== user._id.toString()) {
//                 return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
//             }
//         } else if (user.role === 'company_admin') {
//             if (jobPosted.companyid.toString() !== user.companyid.toString()) {
//                 return res.status(400).json({ message: "Access Denied: not allowed to manage applications for the jobid" });
//             } 
//         }
//         const applications = await Application.find({ jobid: id }).sort({ createdAt: -1 });
//         const userids = applications.map(item => item.userid);
//         const users = await User.find({ _id: { $in: userids } });
//         const skillsReqInJob = jobPosted.skillids.length;
//         const allApplication = applications.map((item) => {
//             const userid = item.userid;
//             const user = users.find(item => item._id.toString() === userid.toString());
//             const skillInUser = user.skillids.length;
//             const match = Number(skillInUser) / Number(skillsReqInJob) * 100;
//             return {
//                 _id: item._id,
//                 applicant: user.fullname,
//                 title: jobPosted.title,
//                 match
//             }
//         })
//         res.status(200).json({ message: "Fetched applications", applications: allApplication });
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// }

const getMyApplications = async (req, res) => {
    try {
        const user = req.user;
        const applications = await Application.find({ userid: user._id }).lean();
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
                companyname: company.name,
                recruiterid: job.postedby
            }
        });
        res.status(200).json({ message: "Applications fetched", applications: allApplications })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getApplication = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const application = await Application.findById(id);
        res.status(200).json({ message: "Application fetched", application: application });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addApplication, updateApplication, getApplications, getMyApplications, getApplication };
