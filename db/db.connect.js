const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB = process.env.MONGODB

async function initializeDatabase(){
 await mongoose.connect(MONGODB).then(() => {
    console.log("Connected Successfully")
  }).catch((error) => {
    console.log("Connection Failed")
  })
}

module.exports = {initializeDatabase}
