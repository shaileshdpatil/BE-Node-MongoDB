require('dotenv').config()
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const middleware = require('../Auth/middleware');
const owner = require("./ownerRegister")

app.get('/',middleware, async(req,res)=>{
    try{
        const Owner = await owner.findById(req.user.id).select("-password");
        res.json(Owner);
    }catch(err){
        console.error(err.message);
        res.status(400).send("server error");
    }
})

module.exports = app;