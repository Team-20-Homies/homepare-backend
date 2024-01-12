const mongoose = require('mongoose')

const HomesSchema = new mongoose.Schema({
    address: String,
    price: Number,
    property_type: String,
    bedrooms: Number,
    half_bath: Number,
    full_bath: Number,
    living_area: Number,
    yard: Boolean,
    garage: Boolean,
    hoa: Boolean,
    images: Array,
    notes: String,
    sentiment: String,
    archived: Boolean,
    searchID: String,

})

module.exports = mongoose.model('Homes', HomesSchema)
