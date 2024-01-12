const express = require("express");
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwtAuth = require("./middleware/jwtAuth");
const verifySignUp = require('./middleware/verifySignUp')
const bcrypt = require("bcrypt");
require('dotenv').config()

// getting the Models to query the DB
const User = require('./models/User')
const Collections = require('./models/Collection')
const Homes = require('./models/Home')


const app = express();
app.use(express.json());

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
    //   if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //   }
    // })
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

// Login url
app.post("/login", async(req, res) => {

    const loginData = req.body.loginData;
    const username = "panini"; // Replace hard code with DB info
    const password = "badpassword"; // Replace hard code with DB info

    if(username === loginData.username && password === loginData.password){

        const token = jwt.sign({username: username, role: 'user'}, 'temporarysecretkey', {expiresIn: "24h"});
        return res.status(200).send({token});
    }

    return res.status(401).send({error: "Invalid username or password"});
  //  const data = await generateAccessToken();
  //  console.log(data);
  //  res.json(data);
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
