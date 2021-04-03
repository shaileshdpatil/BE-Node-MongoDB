const mongoose = require("mongoose");

mongoose.connect(process.env.DB,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("successfull connected")
}).catch((e)=>{
    console.log("no connection")
})