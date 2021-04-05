require('dotenv').config()
const express = require("express");
const cors = require('cors');
const { check, validationResult } = require("express-validator")
//auth
const auth = require("./model/auth");


const app = express();
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//connextion
require("../db");

//Schema imported registration collections
const User = require("./model/user_register");
const Owner = require("./model/ownerRegister");
const feedback = require("./model/feedbackSchema");
const deal = require("./model/dealSchema");


//port address setup
const port = process.env.PORT || 5000;

app.use(express.json());

//register a user
app.post("/api/user-reg", async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(422).json({ error: "Please enter all fields" })
    }
    try {
        userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "already exist" });
        } else {
            const user = new User({ name, email, phone, password });
            await user.save();
            res.status(200).json(user);
        }
    } catch {
        res.status("400").json(reg);
    }
})


//register a owner 
app.post("/api/ownerRegister", [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('phone', 'phone is required').isLength({ min: 5 }),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, password,gender } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (owner) {
            return res.status(422).json({ error: "email is already exist" })
        }
        const ownerData = new Owner({
            name,
            email,
            password,
            phone,
            gender
        });

        const salt = await bcrypt.genSalt(10);
        ownerData.password = await bcrypt.hash(password, salt);
        await ownerData.save();

        const payload = {
            ownerData:{
                id:ownerData.id
            }
        }

        jwt.sign(payload,process.env.TOKEN_KEY,{expiresIn:36000},(err,token)=>{
            if(err) throw err;
            res.status(200).json({token})
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//login a owner 
app.post("/api/ownerLogin", [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password} = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(422).json({ error: "envalid data" })
        }

        const checkpass = await bcrypt.compare(password,owner.password);
        if(!checkpass){
            return res.status(422).json({ error: "envalid data" })
        }

        const payload = {
            owner:{
                id:owner.id
            }
        }

        jwt.sign(payload,process.env.TOKEN_KEY,{expiresIn:36000},(err,token)=>{
            if(err) throw err;
            res.status(200).json({token})
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//display owner details on anywhere 
app.get("/api/ownerDisplay", async (req, res) => {
    const ownerD = await Owner.find();
    try {
        if (!ownerD) throw Error("something wrong")
        res.status("200").json(ownerD);
    } catch {
        res.status("400").json(ownerD);
    }
})

//fedback from which owner 
app.post("/api/feedback", auth, async (req, res) => {
    const { email, comment } = req.body;
    try {
        const feedbacks = new feedback({
            email,
            comment,
            owner: req.user._id
        })
        const feedbacksave = await feedbacks.save();
        res.json(feedbacksave);
    } catch {
        res.status(401).json({ msg: "error" });
    }
})

//display feedback
app.get("/api/feedbackDisplay", async (req, res) => {
    const feedbacD = await feedback.find();
    try {
        if (!feedbacD) throw Error("something wrong")
        res.status("200").json(feedbacD);
    } catch {
        res.status("400").json(feedbacD);
    }
})

//total deals will display
app.get("/api/dealDisplay", async (req, res) => {
    const dealSave = await deal.find();
    try {
        if (!dealSave) throw Error("something wrong")
        res.status("200").json(dealSave);
    } catch {
        res.status("400").json(dealSave);
    }
})

//delete owners api
app.delete("/api/deleteOwner/:id", async function (req, res) {
    Owner.deleteOne({ _id: req.params.id }).then((res) => {
        res.status(200).json("successfully deleted")
    }).catch(
        res.status(400).json("failed")
    )
})

app.listen(port, () => {
    console.log("port success")
})