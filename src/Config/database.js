const mongoose = require('mongoose')
require('dotenv').config({path:'../../.env'})


async function connectDB(){
    try{
        await mongoose.connect("mongodb://localhost:27017/cardioCita")
    }
    catch(error){
        console.error("Conexión fallida ")
    }
}

module.exports = connectDB