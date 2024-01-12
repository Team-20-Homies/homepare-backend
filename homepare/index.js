const express = require("express");
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
require('dotenv').config()
const axios = require("axios")

// getting the Models to query the DB
const User = require('./models/User')
const search = require('./models/Searches')
const Homes = require('./models/Home')


const app = express();
app.use(express.json());


// users - collection
app.post('/user', async (req, res) => {
    //get user info and compare for login. issue token?
    const user = await User.create(req.body)
    res.json({ user })
})

app.get('/user', async (req, res) => {
    const user = await User.find({}).exec();
    res.json({ user })
})


// collections - collection
app.get('/collections', async (req, res) => {
    //get info from database and return json
    const search = await Search.find({}).exec();
    res.json({ search })
})

app.post('/collections', async (req, res) => {
    //pushes new collection info into db
    const search = await Search.create(req.body)
    console.log(req.body)
    res.json({ search })
})


// homes - collection
app.get('/homes', async (req, res) => {
    //gets info for all homes
    console.log('inside of get homes')
    const homes = await Homes.find({}).exec();
    res.json({ homes })
})

app.post('/homes', async (req, res) => {
    console.log('HELLO WORLD!!', req);
    const address = req.body.address
    let results = {}
    try {
        let response = await axios.get('https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=' + { address })
        results = response.property
    } catch {
        console.log(err);
        res.status(500).json({ msg: "something bad has occurred." });
    }

    // axios.get('https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=' + { address })
    //     .then((response) => {
    //         results = response.data
    //         console.log('response: ', response.data.property)
    //         console.log('results: ', results)
    //     })
    // const homes = await Homes.create(req.body)
    console.log('axios results: ', results)
    const homes = await Homes.create(
        { 'address': results[address].oneLine },
        { 'price': null }, // need this field
        { "property_type": results[summary].propertyType },
        { "bedrooms": results.building.rooms.beds },
        { "half_bath": results.building.rooms.bathspartial },
        { "full_bath": results.building.rooms.bathsfull },
        { "living_area": results.building.size.livingsize },
        { "yard": null },
        { "garage": null }, //need this field
        { "images": {} },
        { 'notes': req.body.notes },
        { 'sentiment': null }, // fill in after AI integrated
        { 'archived': req.body.archived },
        { 'CollectionID': req.body.CollectionID }


    )
    console.log(req.body)
    res.json({ homes })
})






// connects DB and starts app
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(3000, () => console.log("API server is running..."));

    } catch (error) {
        console.log(error);
    }
}

start();
