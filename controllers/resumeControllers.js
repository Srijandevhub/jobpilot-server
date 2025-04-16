const Resume = require('../models/resumeModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');

const addResumes = async (req, res) => {
    try {
        const user = req.user;
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const uploadedUrls = [];
        const resumeIds = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.originalname.split('.').pop();
            const publicId = `resume_${user._id}_${i}.${fileExt}`;
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: 'jobpilot_resumes',
                    public_id: publicId,
                    resource_type: 'raw',
                }, async (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    uploadedUrls.push(result.secure_url);

                    const createdResume = await Resume.create({
                        userid: user._id,
                        url: result.secure_url,
                        publicid: publicId
                    });
                    resumeIds.push(createdResume._id);
                    resolve();
                });

                stream.end(file.buffer);
            });
        }
        await User.findByIdAndUpdate(user._id, {
            $push: { resumeids: { $each: resumeIds } }
        });
        res.status(200).json({ message: "Resumes added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getResumes = async (req, res) => {
    try {
        const user = req.user;
        const resumes = await Resume.find({ userid: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Resumes fetched", resumes: resumes });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findById(id);
        await cloudinary.uploader.destroy(resume.publicid, {
            resource_type: 'raw',
        });
        await Resume.findByIdAndDelete(id);
        res.status(200).json({ message: "Resumes deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { addResumes, getResumes, deleteResume };