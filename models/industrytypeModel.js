const mongoose = require('mongoose');

const industrytypeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] }
})

const Industrytype = mongoose.model("industrytypes", industrytypeSchema);

module.exports = Industrytype;