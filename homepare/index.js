const express = require("express");
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./models/User')
const Collections = require('./models/Collection')


const app = express();

app.post('/user', async (req, res) => {
    //get user info and compare for login. issue token?
    const user = await User.create(
        req.body
        // { 'username': 'panini' },
        // { 'password': 'badpassword' },
        // { 'email': 'panini@gmail.com' },
        // { 'first_name': 'panini' },
        // { 'last_name': 'smith' },
        // { 'address': '12345 panini lane, raleigh, nc' },
    )
    res.send(201).json({ user })
})

app.get('/collections', (req, res) => {
    //get info from database and return json
    const collections = Collections.find({})
    // res.send(201).
    res.json({ collections })
})

app.post('/collections', (req, res) => {
    //pushes new collection info into db
    const collections = Collections.create(req.body)
    res.send(201).json({ collections })
})

app.get('/homes', (req, res) => {
    //gets info for all homes
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