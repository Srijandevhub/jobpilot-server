const Category = require('../models/categoryModel');
const Job = require('../models/jobModel');
const Jobrole = require('../models/jobroleModel');
const Company = require('../models/companyModel');
const Industrytype = require('../models/industrytypeModel');

const getCategoriesPublic = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createAt: -1 }).skip(0).limit(8);
        const now = new Date();
        const complete = [];
        for (let i = 0; i < categories.length; i++) {
            const jobCount = await Job.countDocuments({ categoryid: categories[i]._id, jobexpiry: { $gte: now } });
            complete.push({
                _id: categories[i]._id,
                title: categories[i].title,
                icon: categories[i].icon,
                openings: jobCount
            });
        }
        res.status(200).json({ message: "Categories fetched", categories: complete });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobsPublic = async (req, res) => {
    try {
        const { skip = 0, query = "", category = "", jobrole = "" } = req.query;
        const now = new Date();

        const categoryIds = category ? category.split(',').map(id => id.trim()) : [];
        const jobroleids = jobrole ? jobrole.split(",").map(id => id.trim()) : [];

        const searchQuery = {
            isarchieved: false,
            jobexpiry: { $gte: now },
            ...(query && { title: { $regex: query, $options: 'i' } }),
            ...(categoryIds.length > 0 && { categoryid: { $in: categoryIds } }),
            ...(jobroleids.length > 0 && { jobroleid: { $in: jobroleids } })
        };

        const jobs = await Job.find(searchQuery).sort({ createdAt: -1 }).skip(Number(skip)).limit(15).lean();
        const companyIds = [
            ...new Set(
                jobs
                .map(job => {
                    if (typeof job.companyid === 'object' && job.companyid !== null && job.companyid._id) {
                    return job.companyid._id.toString();
                    }
                    return job.companyid?.toString();
                })
                .filter(Boolean)
            )
        ];

        const companies = await Company.find({ _id: { $in: companyIds } }).lean();

        const companyMap = {};
        companies.forEach(company => {
            companyMap[company._id.toString()] = company;
        });
        const complete = jobs.map(job => ({
            ...job,
            company: companyMap[job.companyid.toString()]
        }));
        res.status(200).json({ message: "Jobs fetched", jobs: complete });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobrolesPublic = async (req, res) => {
    try {
        const jobroles = await Jobrole.find().sort({ createdAt: -1 }).skip(0).limit(12);
        const now = new Date();
        const complete = [];
        for (let i = 0; i < jobroles.length; i++) {
            const jobCount = await Job.countDocuments({ jobroleid: jobroles[i]._id, jobexpiry: { $gte: now } });
            complete.push({
                jobroleid: jobroles[i]._id,
                title: jobroles[i].title,
                openings: jobCount
            });
        }
        res.status(200).json({ message: "Jobroles fetched", jobroles: complete });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobPublic = async (req, res) => {
    try {
        const { id } = req.params;
        const now = new Date();
        const job = await Job.findOne({ _id: id, isarchieved: false, jobexpiry: { $gte: now } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const company = await Company.findById(job.companyid);
        res.status(200).json({ message: "Job fetched", job: { job, company: company } });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCompaniesPublic = async (req, res) => {
    try {
        const { query = '', skip = 0 } = req.query;
        const searchQuery = {
            isarchieved: false,
            ...(query && { name: { $regex: query, $options: 'i' } })
        }
        const companies = await Company.find(searchQuery).sort({ createdAt: -1 }).skip(Number(skip)).limit(18);
        const main = [];
        const now = new Date();
        for (let i = 0; i < companies.length; i++) {
            const jobCount = await Job.countDocuments({ companyid: companies[i]._id, jobexpiry: { $gte: now }, isarchieved: false });
            main.push({
                _id: companies[i]._id,
                name: companies[i].name,
                logoimage: companies[i].logoimage,
                position: jobCount
            })
        }
        res.status(200).json({ message: "Companies fetched", companies: main });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCompanyPublic = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findOne({ _id: id, isarchieved: false });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const now = new Date();
        const jobs = await Job.find({ companyid: id, isarchieved: false, jobexpiry: { $gte: now } });
        const indutryType = await Industrytype.findById(company.industrytypeid);
        res.status(200).json({ message: "Company fetched", company: company, jobs: jobs, industrytype: indutryType });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { getCategoriesPublic, getJobsPublic, getJobrolesPublic, getJobPublic, getCompaniesPublic, getCompanyPublic };
