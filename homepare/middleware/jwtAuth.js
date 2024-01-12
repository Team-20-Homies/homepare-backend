const jwt = require("jsonwebtoken");
// const models  = require("../models");
const config = require("../config/auth.config.js");
const User = require('../models/User.js');

verifyToken = (req, res, next) => {
    let token = req.deaders["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided"});
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized", });
            }
            req.userId = decoded.indexOf;
            next();
        });
};


const jwtAuth = {
    verifyToken
}

module.exports = jwtAuth;