const mongoose = require('mongoose')
require('dotenv').config({path:'../../.env'})


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch(error){
        console.error("Conexión fallida ")
    }
}

module.exports = connectDB