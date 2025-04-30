const Category = require('../models/categoryModel');
const cloudinary = require('../config/cloudinaryConfig');

const addCategory = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: add category not allowed" });
        }
        const { title } = req.body;
        const icon = req.file;

        if (!title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!icon) {
            return res.status(400).json({ message: "Icon is required" });
        }
        const newCategory = new Category({
            title
        });
        await newCategory.save();
        const publicId = `jobpilot-category-${newCategory._id}`;
        const stream = cloudinary.uploader.upload_stream({
            folder: "jobpilot_category",
            public_id: publicId,
            overwrite: true,
            resource_type: 'image'
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Upload failed: Cloudinary error", error: error.message });
            }
            await Category.findByIdAndUpdate(newCategory._id, { icon: result.secure_url });
        });
        stream.end(icon.buffer);
        res.status(200).json({ message: "Category added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: get categories not allowed" });
        }
        const categories = await Category.find().sort({ createdAt: -1 });
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
