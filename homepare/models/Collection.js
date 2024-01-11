const mongoose = require('mongoose')

const CollectionsSchema = new mongoose.Schema({
    collection_name: String,
    userID: String,
    houseID: String,
    //query params ???
})

module.exports = mongoose.model('Collections', CollectionsSchema)