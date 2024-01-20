const express = require("express");
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
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
const Blacklist = require("./models/Blacklist.js");
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
        const userId = user._id;
        console.log("After response", userId)
        // Automatically create a "My List" for all new users
        const search = await Searches.create({
            "search_name": "My List",
            "userID": userId
        })
    })

// users - collection
app.post('/user', [jwtAuth.verifyToken], async (req, res) => {
    //get user info and compare for login. issue token?
    const user = await User.create(req.body)
    res.json({ user })
})

app.get('/user', [jwtAuth.verifyToken], async (req, res) => {
    const user = await User.find({}).exec();
    res.json({ user })
})


// collections - collection
app.get('/collections', [jwtAuth.verifyToken], async (req, res) => {
    // Extract userID from jwt payload
    const UserID = req.UserID
    //get info from database and return json
    const search = await Searches.find({userID: UserID}).exec();
    res.json({ search })
})

app.post('/collections', [jwtAuth.verifyToken], async (req, res) => {
    const userID = req.UserID;
    Object.assign(req.body, { userID });
    //pushes new collection info into db
    const search = await Searches.create(req.body)
    console.log(req.body)
    res.json({ search })
})

app.put('/collections/:id', [jwtAuth.verifyToken], async (req, res) => {
    const UserID = req.UserID
    try {
        const search = await Searches.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json({ search })
    } catch {
        res.status(500).json(Error)
    }
})


// homes - collection
app.get('/homes', [jwtAuth.verifyToken], async (req, res) => {
    //Get User's My List collection
    const UserID = req.UserID
    const myList = await Searches.find({ userID: UserID, search_name: "My List" }).exec();
    console.log(myList)

    // Separate searchID from object
    const myHomeIDs = myList[0].houseID;
    console.log("My List ID:", myHomeIDs)
    
    //gets info for all homes
    console.log('inside of get homes')
    const homes = await Homes.find({ _id: myHomeIDs }).exec();
    res.json({ homes })
})

app.post('/homes', [jwtAuth.verifyToken], async (req, res) => {
    // Find the logged in user's My List
    const UserID = req.UserID;
    const myList = await Searches.find({ userID: UserID }).exec();

    // Separate searchID from search object
    const myListID = myList[0]._id;
    console.log("Search Id: ", myListID)

    // pushes new home listing into db
    const home = await Homes.create(req.body);
    res.json({ home })

    // Update My List to add all new homes _id to it
    const homeId = home._id.toString()
    console.log(homeId)
    const search = await Searches.findByIdAndUpdate(myListID, { $push: {houseID: homeId }})
})

// home details 
app.get('/home/:id', [jwtAuth.verifyToken], (req, res) => {
    const homes = Homes.findById(req.params._id).exec();
    res.json(homes)
})

app.put('/homes/:id', [jwtAuth.verifyToken], async (req, res) => {
    try {
        const home = await Homes.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(home)
    } catch {
        res.status(500).json(Error)
    }
})


// user preference endpoints
app.post('/user-preference', [jwtAuth.verifyToken], async (req, res) => {
    const UserID = req.UserID
    Object.assign(req.body, { UserID })
    console.log("New req.body", req.body)
    const userPref = await UserPreference.create(req.body)
    res.json({ userPref })
})

app.get('/user-preference', [jwtAuth.verifyToken], async (req, res) => {
    const UserID = req.UserID;
    Object.assign(req.body, { UserID });
    console.log(UserID)
    try {
        const userPref = await UserPreference.findOne({ UserID: UserID });
        res.json(userPref)
    } catch {
        res.status(500).json(Error)
    }
})


// Login url
app.post("/login", [verifyLogin.verifyCredentials], async (req, res) => {

    const username = req.body.username;

    // Extracting the User's Id based on username at login
    const userObj = await User.find({ username: username });
    const user = userObj[0];
    const userId = user._id;

    const token = jwt.sign({userId: userId}, config.secret, {expiresIn: "24h"});
    return res.status(200).send({token});
})

// Logout function
app.get("/logout", async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).send({ message: "No authorization token"})
    };
    const accessToken = authHeader.split(' ')[1];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    if (checkIfBlacklisted) {
        return res.status(401).send({ message: "Unauthorized: Token expired"});
    }
    const newBlacklist = new Blacklist({
        token: accessToken,
    });
    await newBlacklist.save();
    res.status(200).send({ message: 'Successfully logged out'});
});


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
