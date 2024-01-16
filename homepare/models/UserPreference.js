const mongoose = require('mongoose')

const UserPreferenceSchema = new mongoose.Schema({
    address: String,
    bedrooms: Number,
    bathrooms: Number,
    yard: Boolean,
    garage: Boolean,
    hoa: Boolean,
    UserID: String, //FK
})

module.exports = mongoose.model('UserPreference', UserPreferenceSchema)