const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    address: String,
    notes: String,
    sentiment: String,
    archived: Boolean,
    CollectionID: String,
    // add mls fields to schema

})

module.exports = mongoose.model('Home', HomeSchema)