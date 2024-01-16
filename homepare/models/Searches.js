const mongoose = require('mongoose')

const SearchSchema = new mongoose.Schema({
    search_name: String,
    userID: String,
    houseID: Array,
    query_params: String
})

module.exports = mongoose.model('Searches', SearchSchema)
