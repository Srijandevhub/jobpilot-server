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

module.exports = { addApplication, updateApplication };