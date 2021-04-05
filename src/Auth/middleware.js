const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
require('dotenv').config()



module.exports = function(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).json({msg:"not found tokens"})
    }
    try{
        const checktoken = jwt.verify(token,process.env.TOKEN_KEY);
        req.user = checktoken.user;
        next();
    }catch(err){
        res.status(401).json({msg:"token invalid"})
    }
}