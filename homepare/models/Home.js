const mongoose = require('mongoose')

const HomesSchema = new mongoose.Schema({
    address: String,
    property_type: String,
    bedrooms: Number,
    bathrooms: Number,
    living_area: Number,
    yard: Boolean,
    garage: Boolean,
    hoa: Boolean,
    images: Array,
    notes: String,
    sentiment: String,
    archived: Boolean,
    CollectionID: String,

})

module.exports = mongoose.model('Homes', HomesSchema)