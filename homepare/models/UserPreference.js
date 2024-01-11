const mongoose = require('mongoose')

const UserPreferenceSchema = new mongoose.Schema({
<<<<<<< HEAD
    address: String,
    bedrooms: Number,
    bathrooms: Number,
    yard: Boolean,
    garage: Boolean,
    hoa: Boolean,
    UserID: String, //FK
=======
    UserID: String,
>>>>>>> main
})

module.exports = mongoose.model('UserPreference', UserPreferenceSchema)