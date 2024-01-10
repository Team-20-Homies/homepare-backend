const mongoose = require('mongoose')

const UserPreferenceSchema = new mongoose.Schema({
    UserID: String,
})

module.exports = mongoose.model('UserPreference', UserPreferenceSchema)