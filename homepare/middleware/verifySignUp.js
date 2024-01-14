// const models = require('./models');
const User = require('../models/User.js');

// Check for duplicate user name and email
checkDuplicateUserInfo = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if( !username || !email || !password ) {
        return res.status(400).send({ message: "Missing username, email, or password"});
    }

    // Username check
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
        return res.status(400).send({ message: "Username already in use"});
    }

    // Email check
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
        return res.status(400).send({ message: "Email already in use" })
    }

        next();
    };


const verifySignUp = {
    checkDuplicateUserInfo
};

module.exports = verifySignUp;