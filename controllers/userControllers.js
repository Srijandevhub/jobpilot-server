const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { fullname, email, username, password } = req.body;
        if (!fullname.trim()) {
            return res.status(400).json({ message: "Fullname is required" });
        }
        if (!email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!username.trim()) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (!password.trim()) {
            return res.status(400).json({ message: "Password is required" });
        }
        const userExists = await User.find({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password.trim()) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ message: "Entered wrong password" });
        }
        const accessToken = jwt.sign({ _id: user._id, 
            fullname: user.fullname,
            username: user.username,
            email: user.username,
            phonecode: user.phonecode,
            phonenumber: user.phonenumber,
            profilepicture: user.profilepicture,
            title: user.title,
            experiences: user.experiences,
            educations: user.educations,
            personalwebsite: user.personalwebsite,
            resumes: user.resumes,
            nationality: user.nationality,
            dateofbirth: user.dateofbirth,
            gender: user.gender,
            maritalstatus: user.maritalstatus,
            biography: user.biography,
            sociallinks: user.sociallinks,
            address: {
                street: user.address.street,
                city: user.address.city,
                state: user.address.state,
                zipcode: user.address.zipcode,
                country: user.address.country
            },
            skills: user.skills,
            languages: user.languages,
            certifications: user.certifications,
            projects: user.projects,
            jobpreferences: user.jobpreferences,
            role: user.role
        }, process.env.ACCESS, {
            expiresIn: '15m'
        });
        const refreshToken = jwt.sign({ _id: user._id, 
            fullname: user.fullname,
            username: user.username,
            email: user.username,
            phonecode: user.phonecode,
            phonenumber: user.phonenumber,
            profilepicture: user.profilepicture,
            title: user.title,
            experiences: user.experiences,
            educations: user.educations,
            personalwebsite: user.personalwebsite,
            resumes: user.resumes,
            nationality: user.nationality,
            dateofbirth: user.dateofbirth,
            gender: user.gender,
            maritalstatus: user.maritalstatus,
            biography: user.biography,
            sociallinks: user.sociallinks,
            address: {
                street: user.address.street,
                city: user.address.city,
                state: user.address.state,
                zipcode: user.address.zipcode,
                country: user.address.country
            },
            skills: user.skills,
            languages: user.languages,
            certifications: user.certifications,
            projects: user.projects,
            jobpreferences: user.jobpreferences,
            role: user.role
        }, process.env.REFRESH, {
            expiresIn: '30d'
        });
        await User.findByIdAndUpdate(user._id,{
            refreshToken: refreshToken
        }, { new: true });
        res.cookie("accessToken_jp", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken_jp", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "User loggedin" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken_jp;
        if (token) {
            await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } });
        }
        res.clearCookie("accessToken_jp");
        res.clearCookie("refreshToken_jp");
        res.status(200).json({ message: "User loggedout" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const protected = async (req, res) => {
    try {
        res.status(200).json({ message: "Authorized", user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const checkRefreshToken = async (req, res) => {
    try {
        const decoded = req.decoded;
        const token = req.token;
        const user = await User.findOne({ _id: decoded._id, refreshtoken: token });
        if (!user) {
            return res.status(403).json({ message: "Access Denied: User does not have access" });
        }
        const accessToken = jwt.sign({ _id: user._id, 
            fullname: user.fullname,
            username: user.username,
            email: user.username,
            phonecode: user.phonecode,
            phonenumber: user.phonenumber,
            profilepicture: user.profilepicture,
            title: user.title,
            experiences: user.experiences,
            educations: user.educations,
            personalwebsite: user.personalwebsite,
            resumes: user.resumes,
            nationality: user.nationality,
            dateofbirth: user.dateofbirth,
            gender: user.gender,
            maritalstatus: user.maritalstatus,
            biography: user.biography,
            sociallinks: user.sociallinks,
            address: {
                street: user.address.street,
                city: user.address.city,
                state: user.address.state,
                zipcode: user.address.zipcode,
                country: user.address.country
            },
            skills: user.skills,
            languages: user.languages,
            certifications: user.certifications,
            projects: user.projects,
            jobpreferences: user.jobpreferences,
            role: user.role
        }, process.env.ACCESS, {
            expiresIn: '15m'
        });
        res.cookie("accesstoken_jp", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { register, login, logout, protected, checkRefreshToken };