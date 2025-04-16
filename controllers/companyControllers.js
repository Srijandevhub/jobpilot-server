const Company = require('../models/companyModel');
const cloudinary = require('../config/cloudinaryConfig');

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
        const { description, foundedin, organisationtype, teamsize, website, phonecode, phonenumber, email, isarchieved, industrytypeid } = req.body;
        const updatedCompany = await Company.findByIdAndUpdate(user.companyid, {
            description,
            foundedin,
            organisationtype,
            teamsize,
            website,
            phonecode,
            phonenumber,
            email,
            isarchieved,
            industrytypeid: industrytypeid === 'none' ? null : industrytypeid
        }, { new: true });
        res.status(200).json({ message: "Company updated", company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateMyCompanyCover = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const companyid = req.user.companyid;
        const publicId = `jobpilot-company-cover-${companyid}`;
        const stream = cloudinary.uploader.upload_stream({
            folder: "jobpilot_company",
            public_id: publicId,
            overwrite: true,
            resource_type: 'image'
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Upload failed: Cloudinary error", error: error.message });
            }
            await Company.findByIdAndUpdate(companyid, { coverimage: result.secure_url });
            return res.status(200).json({ imageUrl: result.secure_url });
        });
        stream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateMyCompanyLogo = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const companyid = req.user.companyid;
        const publicId = `jobpilot-company-logo-${companyid}`;
        const stream = cloudinary.uploader.upload_stream({
            folder: "jobpilot_company",
            public_id: publicId,
            overwrite: true,
            resource_type: 'image'
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Upload failed: Cloudinary error", error: error.message });
            }
            await Company.findByIdAndUpdate(companyid, { logoimage: result.secure_url });
            return res.status(200).json({ imageUrl: result.secure_url });
        });
        stream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addCompany, getCompanies, getMyCompany, updateMyCompany, updateMyCompanyCover, updateMyCompanyLogo };
