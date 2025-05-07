const Skill = require('../models/skillModel');
const addNewSkill = async (req, res) => {
    try {
        const { title } = req.body;
        const skillexists = await Skill.findOne({ title });
        if (skillexists) {
            return res.status(400).json({ message: "Skill already exists" });
        }
        const newSkill = new Skill({
            title
        });
        await newSkill.save();
        res.status(200).json({ message: "Skill added", skill: newSkill });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json({ message: "Skills fetched", skills: skills });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addNewSkill, getSkills };