const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;