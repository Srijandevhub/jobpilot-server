const Category = require('../models/categoryModel');
const Job = require('../models/jobModel');

const getCategoriesPublic = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createAt: -1 }).skip(0).limit(8);
        res.status(200).json({ message: "Categories fetched", categories: categories });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getJobsPublic = async (req, res) => {
    try {
        const { skip = 0, query = "" } = req.query;
        const searchQuery = query ? { title: { $regex: query, $options: 'i' } } : {};
        const jobs = await Job.find({ isarchieved: false, ...searchQuery }).sort({ createdAt: -1 }).skip(Number(skip)).limit(15);
        res.status(200).json({ message: "Jobs fetched", jobs: jobs });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { getCategoriesPublic, getJobsPublic };