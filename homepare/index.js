const express = require("express");
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
require('dotenv').config()

// getting the Models to query the DB
const User = require('./models/User')
const Collections = require('./models/Collection')
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
    const collections = await Collections.find({}).exec();
    res.json({ collections })
})

app.post('/collections', async (req, res) => {
    //pushes new collection info into db
    const collections = await Collections.create(req.body)
    console.log(req.body)
    res.json({ collections })
})


// homes - collection
app.get('/homes', async (req, res) => {
    //gets info for all homes
    const homes = await Homes.find({}).exec();
    res.json({ homes })
})

app.post('/homes', async (req, res) => {
    const homes = await Homes.create(req.body)
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