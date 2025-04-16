const Company = require('../models/companyModel');

const addCompany = async (req, res) => {
    try {
        const { name } = req.body;
        const newCompany = new Company({
            name
        });
        await newCompany.save();
        res.status(200).json({ message: "Company added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Companies fetched", companies: companies });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getMyCompany = async (req, res) => {
    try {
        const user = req.user;
        const company = await Company.findById(user.companyid);
        if (!company) {
            return res.status(400).json({ message: "Company not found" });
        }
        res.status(200).json({ message: "Company fetched", company: company });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateMyCompany = async (req, res) => {
    try {
        const user = req.user;
        const { description, foundedin, organisationtype, teamsize, website, phonecode, phonenumber, email, isarchieved } = req.body;
        const updatedCompany = await Company.findByIdAndUpdate(user.companyid, {
            description,
            foundedin,
            organisationtype,
            teamsize,
            website,
            phonecode,
            phonenumber,
            email,
            isarchieved
        }, { new: true });
        res.status(200).json({ message: "Company updated", company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addCompany, getCompanies, getMyCompany, updateMyCompany };