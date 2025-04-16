const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinaryConfig');

const register = async (req, res) => {
    try {
        const { fullname, email, username, password, confirmpassword } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User already registered" });
        }
        if (!fullname.trim()) {
            return res.status(400).json({ message: "Fullname is required!" });
        }
        if (!email.trim()) {
            return res.status(400).json({ message: "Email is required!" });
        }
        if (!username.trim()) {
            return res.status(400).json({ message: "Username is required!" });
        }
        if (!password.trim()) {
            return res.status(400).json({ message: "Password is required!" });
        }
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
            return res.status(400).json({ message: "Enter valid password" });
        }
        if (!confirmpassword.trim()) {
            return res.status(400).json({ message: "Confirmpassword is required!" });
        }
        if (password.trim() !== confirmpassword.trim()) {
            return res.status(400).json({ message: "Password and confirmpassword does not matched" });
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
        const { identifier, password } = req.body;
        if (!identifier.trim()) {
            return res.status(400).json({ message: "Email or Username is required" });
        }
        if (!password.trim()) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ message: "Entered wrong password" });
        }
        const accessToken = jwt.sign({ _id: user._id, 
            username: user.username,
            email: user.email,
            role: user.role,
            companyid: user.companyid
        }, process.env.ACCESS, {
            expiresIn: '15m'
        });
        const refreshToken = jwt.sign({ _id: user._id, 
            username: user.username,
            email: user.email,
            role: user.role,
            companyid: user.companyid
        }, process.env.REFRESH, {
            expiresIn: '30d'
        });
        await User.findByIdAndUpdate(user._id,{
            refreshtoken: refreshToken
        }, { new: true });
        res.cookie("accessToken_jp", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken_jp", refreshToken, {
            httpOnly: true,
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
            await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: "" } });
        }
        res.clearCookie("accessToken_jp", {
            httpOnly: true
        });
        res.clearCookie("refreshToken_jp", {
            httpOnly: true
        });
        res.status(200).json({ message: "User loggedout" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const protected = async (req, res) => {
    try {
        const userid = req.user._id;
        const user = await User.findById(userid);
        res.status(200).json({ message: "Authorized", user: user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateMyProfile = async (req, res) => {
    try {
        const { fullname, phonecode, phonenumber, title, personalwebsite, nationality, dateofbirth, gender, maritalstatus, biography, street, city, state, country, zipcode } = req.body;
        const userid = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userid, {
            fullname,
            phonecode,
            phonenumber,
            title,
            personalwebsite,
            nationality,
            dateofbirth,
            gender,
            maritalstatus,
            biography,
            address: {
                street,
                city,
                state,
                country,
                zipcode
            }
        }, { new: true });
        res.status(200).json({ message: "Updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateProfileImage = (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const userid = req.user._id;
        const publicId = `jobpilot-profilepicture-${userid}`;
        const stream = cloudinary.uploader.upload_stream({
            folder: "jobpilot_user",
            public_id: publicId,
            overwrite: true,
            resource_type: 'image'
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Upload failed: Cloudinary error", error: error.message });
            }
            await User.findByIdAndUpdate(userid, { profilepicture: result.secure_url });
            return res.status(200).json({ imageUrl: result.secure_url });
        });
        stream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const addUser = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: Add user not allowed" });
        }
        const { fullname, email, username, password, role, companyid } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            role,
            companyid: companyid === 'none' ? null : companyid,
            createdby: user._id
        });
        await newUser.save();
        res.status(200).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'applicant') {
            return res.status(400).json({ message: "Access denied: Get users not allowed" });
        }
        let users = [];
        if (user.role === 'super_admin') {
            users = await User.find({ _id: { $ne: user._id } }).sort({ createdAt: -1 });
        } else if (user.role === "company_admin") {
            users = await User.find({ _id: { $ne: user._id }, companyid: user.companyid }).sort({ createdAt: -1 });
        } else if (user.role === "recruiter") {
            users = await User.find({ createdby: user._id }).sort({ createdAt: -1 });
        }
        res.status(200).json({ message: "User fetched", users: users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { register, login, logout, protected, updateMyProfile, updateProfileImage, addUser, getUsers };