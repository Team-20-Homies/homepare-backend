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
const search = require('./models/Searches')
const Homes = require('./models/Home');
const verifyLogin = require("./middleware/verifyLogin");
const Blacklist = require("./models/Blacklist.js");


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
    const address = req.body.address;
    let results = {};

    // call to the realty API
    try {
        let response = await axios.get('https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=' + address, {
            headers: {
                Accept: 'application/json',
                apikey: '2b1e86b638620bf2404521e6e9e1b19e',
            }
        });
        results = response.data.property[0];

        // adds results from realty api to the DB
        const homes = await Homes.create({
            "address": results.address.oneLine,
            "price": null,
            "property_type": results.summary.propertyType,
            "bedrooms": results.building.rooms.beds,
            "half_bath": results.building.rooms.bathspartial,
            "full_bath": results.building.rooms.bathsfull,
            "living_area": results.building.size.livingsize,
            "yard": null,
            "garage": null,
            "hoa": null,
            "images": {},
            "notes": null,
            "sentiment": null,
            "archived": null,
            "searchID": null,
        })
        res.json({ homes });
    } catch {
        // console.log(err);
        res.status(500).json({ msg: "something bad has occurred." });
    }
})

// Login url
app.post("/login", [verifyLogin.verifyCredentials] , (req, res) => {

    const username = req.body.username;

    const token = jwt.sign({username: username}, config.secret, {expiresIn: "24h"});
    return res.status(200).send({token});
})

// Logout function
app.get("/logout", async (req, res) => {
    console.log(req);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).send({ message: "No authorization token"})
    };
    console.log(authHeader)
    const accessToken = authHeader.split(' ')[1];
    console.log(accessToken);
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    if (checkIfBlacklisted) {
        return res.status(401).send({ message: "Unauthorized: Token expired"});
    }
    const newBlacklist = new Blacklist({
        token: accessToken,
    });
    await newBlacklist.save();
    res.setHeader('Clear-Site-Data', '"cookies"');
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
