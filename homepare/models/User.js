const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    first_name: String,
    last_name: String,
    address: String,
    session_Id: String,
})

module.exports = mongoose.model('User', UserSchema)