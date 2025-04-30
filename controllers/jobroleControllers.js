const Jobrole = require('../models/jobroleModel');

const addJobrole = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: add jobrole not allowed" });
        }
        const { title } = req.body;
        const newJobrole = new Jobrole({
            title
        });
        await newJobrole.save();
        res.status(200).json({ message: "Job role added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobRoles = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: get jobroles not allowed" });
        }
        const jobroles = await Jobrole.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Fetched job roles", jobroles: jobroles });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message }); 
    }
}

module.exports = { addJobrole, getJobRoles };