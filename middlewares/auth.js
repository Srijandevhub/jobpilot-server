const jwt = require('jsonwebtoken');

const verifyAccesstoken = (req, res, next) => {
    const token = req.cookies.accessToken_jp;
    if (!token) {
        return res.status(401).json({ message: "Access Denied: Accesstoken not present" });
    }
    jwt.verify(token, process.env.ACCESS, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Access Denied: Error in accesstoken" });
        }
        req.user = decoded;
        next();
    });
}

const verifyRefreshtoken = (req, res, next) => {
    const token = req.cookies.refreshToken_jp;
    if (!token) {
        return res.status(401).json({ message: "Access Denied: Refreshtoken not present" });
    }
    req.token = token;
    req.decoded = jwt.verify(token, process.env.REFRESH);
    next();
}

const verifySuperAdmin = (req, res, next) => {
    const token = req.cookies.accessToken_jp;
    if (!token) {
        return res.status(401).json({ message: "Access Denied: Accesstoken not present" });
    }
    jwt.verify(token, process.env.ACCESS, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Access Denied: Error in accesstoken" });
        }
        if (decoded.role !== 'super_admin') {
            return res.status(403).json({ message: "Access Denied: Not super admin" });
        }
        next();
    });
}

module.exports = { verifyAccesstoken, verifyRefreshtoken, verifySuperAdmin };