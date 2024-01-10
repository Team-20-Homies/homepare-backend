const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    address: String,
    bedrooms: Number,
    bathrooms: Number,
    yard: Boolean,
    garage: Boolean,
    hoa: Boolean,
    notes: String,
    sentiment: String,
    archived: Boolean,
    CollectionID: String,
    // add mls fields to schema

})

module.exports = mongoose.model('Home', HomeSchema)