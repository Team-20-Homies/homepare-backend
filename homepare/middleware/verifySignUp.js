// const models = require('./models');
const User = require('../models/User.js');

// Check for duplicate user name and email
checkDuplicateUserInfo = (req, res, next) => {
    // Username check
    // try {
    User.findOne({
        username: req.body.username
    }).exec() 
        // if (err) {
        //     res.status(500).send({ message: err });
        //     return;
        // }

        // if (user) {
        //     res.status(400).send({ message: "Username Already Exists"});
        //     return;
        // }
    

        // Email check
        // User.findOne({
        //     email:  req.body.email
        // }).exec(() => {
        //     // if () {
        //     //     res.status(500).send({ message: err });
        //     //     return;
        //     // }

        //     if (user) {
        //         res.status(400).send({ message: "Email already in use" });
        //         return;
        //     }

            next();
        };
//     });
// };

const verifySignUp = {
    checkDuplicateUserInfo
};

module.exports = verifySignUp;