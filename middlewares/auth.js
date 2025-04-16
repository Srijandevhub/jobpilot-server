const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyAuthentication = (req, res, next) => {
    const tokenAccess = req.cookies.accessToken_jp;
    const tokenRefresh = req.cookies.refreshToken_jp;
    if (!tokenAccess && !tokenRefresh) {
        return res.status(403).json({ message: "Access Denied: No tokens present" });
    }
    if (tokenAccess) {
        jwt.verify(tokenAccess, process.env.ACCESS, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Access Denied: Error in accesstoken" });
            }
            req.user = decoded;
            next();
        });
    } else {
        if (tokenRefresh) {
            jwt.verify(tokenRefresh, process.env.REFRESH, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Access Denied: Error in refreshtoken" });
                }
                const userValid = await User.findOne({ _id: decoded._id, refreshtoken: tokenRefresh });
                if (!userValid) {
                    return res.status(403).json({ message: "Access Denied: User does not have access" });
                }
                const user = decoded;
                const newAccessToken = jwt.sign({ _id: user._id, 
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    companyid: user.companyid
                }, process.env.ACCESS, {
                    expiresIn: '15m'
                });
                res.cookie("accesstoken_jp", newAccessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000
                });
                req.user = decoded;
                next();
            })
        } else {
            return res.status(403).json({ message: "Access Denied: Refresh token is not present" });
        }
    }
}

const verifySuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Access Denied: Not a super admin" });
    }
    next();
}

const verifyCompanyAdmin = (req, res, next) => {
    if (req.user.role !== 'company_admin') {
        return res.status(403).json({ message: "Access Denied: Not a company admin" });
    }
    next();
}

module.exports = { verifyAuthentication, verifySuperAdmin, verifyCompanyAdmin };