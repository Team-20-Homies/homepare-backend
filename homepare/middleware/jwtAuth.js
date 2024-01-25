const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require('../models/User.js');
const Blacklist = require("../models/Blacklist.js");

verifyToken = async (req, res, next) => {
    let tokenHeader = req.headers["authorization"];
    if (!tokenHeader.includes("x-access-token ")) {
        return res.status(401).send({ message: "Unauthorized: Invalid Token" })
    }
    const token = tokenHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    const checkIfBlacklisted = await Blacklist.findOne({ token: token });

    if (checkIfBlacklisted) {
        return res.status(400).send({ message: "Invalid token: Please log in" })
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized", });
            }
            req.UserID = decoded.userId;
            req.UserID = decoded.userId;
            next();
        });
};


const jwtAuth = {
    verifyToken
}

module.exports = jwtAuth;