const User = require('../models/userModel');
const Company = require('../models/companyModel');

const getCounts = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'super_admin') {
            const applicants = await User.countDocuments({ role: 'applicant' });
            const companyadmins = await User.countDocuments({ role: 'company_admin' });
            const recruiters = await User.countDocuments({ role: 'recruiter' });
            const companies = await Company.countDocuments();
            return res.status(200).json({ message: "All fetched", applicant: applicants, companyadmin: companyadmins, recruiter: recruiters, company: companies });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { getCounts };