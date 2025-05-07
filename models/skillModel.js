const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true }
});
const Skill = mongoose.model("skills", skillSchema);
module.exports = Skill;