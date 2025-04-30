const mongoose = require('mongoose');

const jobroleSchema = new mongoose.Schema({
    title: { type: String, required: true }
}, { timestamps: true });

const Jobrole = mongoose.model("jobroles", jobroleSchema);

module.exports = Jobrole;