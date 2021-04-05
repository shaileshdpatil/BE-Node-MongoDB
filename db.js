const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.DB_KEY,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("successfull connected")
}).catch((e)=>{
    console.log("no connection")
})