const Category = require('../models/categoryModel');

const addCategory = async (req, res) => {
    try {
        const { title } = req.body;
        const icon = req.file.path || '';
        if (!title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!icon.trim()) {
            return res.status(400).json({ message: "Icon is required" });
        }
        const newCategoty = new Category({
            icon,
            title
        });
        await newCategoty.save();
        res.status(200).json({ message: "Category added", category: newCategoty });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: "Categories fetched", categories: categories });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        res.status(200).json({ message: "Category fetched", category: category });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        const { title } = req.body;
        const icon = req.file.path || category.icon;
        const updatedCategory = await Category.findByIdAndUpdate(id, {
            icon,
            title
        }, { new: true });
        res.status(200).json({ message: "Category updated", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addCategory, getCategories, getCategory, updateCategory, deleteCategory };