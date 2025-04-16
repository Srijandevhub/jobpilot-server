const Industrytype = require('../models/industrytypeModel');

const addIndustryType = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant' || user.role === "recruiter") {
            return res.status(400).json({ message: "Access denied: not allowed to add industry type" });
        }
        const { title } = req.body;
        const newIndustrytype = new Industrytype({
            title
        });
        await newIndustrytype.save();
        res.status(200).json({ message: "Industry type added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getIndustryTypes = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant' || user.role === "recruiter") {
            return res.status(400).json({ message: "Access denied: not allowed to add industry type" });
        }
        const industrytypes = await Industrytype.find({ status: "active" });
        res.status(200).json({ message: "Industry type fetched", industrytypes: industrytypes });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addIndustryType, getIndustryTypes };