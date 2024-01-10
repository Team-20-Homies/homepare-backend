const express = require("express");
const connectDB = require('./connect')
require('dotenv').config()


const app = express();








// DB connection
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, () => console.log("API server is running..."));

    } catch (error) {
        console.log(error)
    }
}


start()