const Application = require('../models/applicationModel');
const User = require('../models/userModel');

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
        const { id } = req.params;
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

module.exports = { addApplication, updateApplication, getApplications };
