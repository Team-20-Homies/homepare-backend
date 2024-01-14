const jwt = require("jsonwebtoken");
const User = require('../models/User.js');
const bcrypt = require("bcrypt");


verifyCredentials = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check for empty string of required data
    if( !username || !password ) {
        return res.status(400).send({ message: "Missing username or password"});
    }

    // Check if the username exists
    const existingUser = await User.findOne({ username })
    if(!existingUser) {
        return res.status(404).send({ message: "User does not exist" })
    }

    // Check is the password matched
    const checkPassword = bcrypt.compareSync(
        password,
        existingUser.password,
        8
    );

    if (!checkPassword) {
        return res.status(401).send({ token: null, message: "Invalid Password"});
    }

    next()
}

const verifyLogin = {
    verifyCredentials
}

module.exports = verifyLogin;