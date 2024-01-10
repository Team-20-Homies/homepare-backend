const mongoose = require('mongoose')

const RealtorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    agency: String,
    email: String,
    phone_number: String,
})

module.exports = mongoose.model('Realtor', RealtorSchema)