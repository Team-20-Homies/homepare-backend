const mongoose = require('mongoose')

const SearchSchema = new mongoose.Schema({
    search_name: String,
    userID: String,
    houseID: Array,
})

module.exports = mongoose.model('Searches', SearchSchema)
