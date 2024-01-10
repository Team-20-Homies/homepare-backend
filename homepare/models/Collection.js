const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema({
    userID: String,
    houseID: String,
    //query params ???
})

module.exports = mongoose.model('Collection', CollectionSchema)