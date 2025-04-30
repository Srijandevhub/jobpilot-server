const Industrytype = require('../models/industrytypeModel');
const Category = require('../models/categoryModel');
const Jobrole = require("../models/jobroleModel");

const getIndustrytypeFilter = async (req, res) => {
    try {
        const industrytypes = await Industrytype.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Industry types fetched", industrytypes: industrytypes });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const getCategoryFilter = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Categories fetched", categories: categories });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const getJobroleFilter = async (req, res) => {
    try {
        const jobroles = await Jobrole.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Jobroles fetched", jobroles: jobroles });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { getIndustrytypeFilter, getCategoryFilter, getJobroleFilter };