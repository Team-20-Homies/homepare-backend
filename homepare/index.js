const express = require("express");
const connectDB = require('./db/connect');
const mongoose = require('mongoose')
const sentiment_analysis = require('./sentiment-analysis.js')
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwtAuth = require("./middleware/jwtAuth");
const verifySignUp = require('./middleware/verifySignUp')
const bcrypt = require("bcrypt");
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const config = require("./config/auth.config.js");


// getting the Models to query the DB
const User = require('./models/User')
const Searches = require('./models/Searches')
const Homes = require('./models/Home');
const verifyLogin = require("./middleware/verifyLogin");
const UserPreference = require("./models/UserPreference.js");


const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

// Authenticates new user and hashes password
app.post("/register",
    [verifySignUp.checkDuplicateUserInfo],
    async (req, res) => {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        res.json({ user })
    })

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
    const search = await Searches.find({}).exec();
    res.json({ search })
})

app.post('/collections', async (req, res) => {
    //pushes new collection info into db
    const search = await Searches.create(req.body)
    console.log(req.body)
    res.json({ search })
})

app.put('/collections/:id', async (req, res) => {
    try {
        const search = await Searches.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json({ search })
    } catch {
        res.status(500).json(Error)
    }
})


// homes - collection
app.get('/homes', async (req, res) => {
    //gets info for all homes
    console.log('inside of get homes')
    const homes = await Homes.find({}).exec();
    res.json({ homes })
})

app.post('/homes', async (req, res) => {
    // pushes new home listing into db
    const home = await Homes.create(req.body);
    res.json({ home })

})

// home details 
app.get('/home/:id', (req, res) => {
    const homes = Homes.findById(req.params._id).exec();
    res.json(homes)
})

app.put('/homes/:id', [jwtAuth.verifyToken], async (req, res) => {
    let analysis
    let transcription = JSON.stringify(req.body.notes)

    const UserID = req.UserID
    const homeID = req.params.id
    // Check searches for one that contains both UserID and HouseID
    console.log('user id: ', UserID)
    const hasBothIDs = await Searches.find({ userID: UserID, houseID: homeID })
    //Check to see if search returned results
    const arrayIsEmpty = () => {
        if (hasBothIDs.length === 0) {
            return false;
        } else {
            return true;
        }
    }
    if (!arrayIsEmpty()) {
        res.status(400).send({ message: "Unauthorized Access: User credentials invalid for this search" })
    } else {
        // call to the AI sentiment function
        sentiment_analysis(transcription)
            .then(async (results) => {
                // console.log(results)
                analysis = results
                Object.assign(req.body, { sentiment: analysis })
                console.log(typeof (analysis))
                try {
                    const home = await Homes.findByIdAndUpdate(homeID, req.body)
                    console.log('hello world ', home.sentiment)

                    res.json({ home })
                } catch (error) {
                    console.log(error)
                }
            })
    }
})


// user preference endpoints
app.post('/user-preference', async (req, res) => {
    const userPref = await UserPreference.create(req.body)
    res.json({ userPref })
})


// Login url
app.post("/login", [verifyLogin.verifyCredentials], (req, res) => {

    const username = req.body.username;

    const token = jwt.sign({ username: username, role: 'user' }, config.secret, { expiresIn: "24h" });
    return res.status(200).send({ token });
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
