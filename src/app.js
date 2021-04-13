require('dotenv').config()
const express = require("express");
const cors = require('cors');
const { check, validationResult } = require("express-validator")


//auth
const auth = require("./Auth/middleware");

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
const Allproperty = require("./model/allproperty")
const package = require("./model/packages");
const category = require("./model/category");
const subcategory = require("./model/subcategory");
const city = require("./model/city");
const state = require("./model/state");
const admin = require("./model/adminData");

//port address setup
const port = process.env.PORT || 3000;

app.use(express.json());

//fedback from which owner 
app.post("/api/feedbackssadd", async (req, res) => {
    const { name, email,message } = req.body;
    try {
        const feedbackadd = new feedback({
            name, email,message
        });
        await feedbackadd.save();
        res.status(200).send("successfully inserted");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});

//login a owner 
app.post("/api/AdminLogin", [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let adminLogin = await admin.find({ email,password });
        if (!adminLogin) {
            return res.status(422).json({ error: "envalid data" })
        }

        const payload = {
            adminLogin: {
                id: adminLogin.id
            }
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//insert admin
// app.post("/api/adminadd", async (req, res) => {
//     const { email,password } = req.body;
//     try {
//         const adminadd = new admin({
//             email,
//             password
//         });
//         await adminadd.save();
//         res.status(200).send("successfully inserted");
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("server error");
//     }
// });

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
app.post("/api/ownerRegister", async (req, res) => {
    const { names, email, phone, password, gender } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (owner) {
            return res.status(422).json({ error: "email is already exist" })
        }
        const ownerData = new Owner({
            names,
            email,
            password,
            phone,
        });

        const salt = await bcrypt.genSalt(10);
        ownerData.password = await bcrypt.hash(password, salt);
        await ownerData.save();

        const payload = {
            ownerData: {
                id: ownerData.id
            }
        }
        const user = {
            ownerDate:{
                names: ownerData.names
            }
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ user })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//display
app.get("/api/categoryDisplay", async (req, res) => {
    const categorysfind = await category.find();
    try {
        if (!categorysfind) throw Error("something wrong")
        res.status("200").json(categorysfind);
    } catch {
        res.status("400").json(categorysfind);
    }
})

//delete category
app.delete("/api/deleteOcategory/:id", async function (req, res) {
    try {
        const deletecategory = await category.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletecategory);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletecategory);
    }
})

//login a owner 
app.post("/api/ownerLogin", [
    check('email', 'email is required').not().isEmpty(),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(422).json({ error: "envalid data" })
        }

        const checkpass = await bcrypt.compare(password, owner.password);
        if (!checkpass) {
            return res.status(422).json({ error: "envalid data" })
        }

        const payload = {
            owner: {
                id: owner.id
            }
        }

        const user = {
            status: owner.status,
            email: owner.email
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ user })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//insert property
app.post("/api/insertproperty", async (req, res) => {
    const { name, type, amount } = req.body;
    try {
        const property = new Allproperty({
            name,
            type,
            amount
        });
        await property.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});




//insert state
app.post("/api/stateadd",auth, [
    check('country', 'country is required').isLength({ min: 3, max: 15 }),
    check('states', 'state is required').isLength({ min: 3, max: 15 })
], async (req, res) => {
    const { country, states } = req.body;
    try {
        const stateadds = new state({
            country, states
        });
        await stateadds.save();
        res.status("200").send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status("400").send("server error");
    }
});

//all state display
app.get("/api/statedisp", async (req, res) => {
    const statecat = await state.find();
    try {
        if (!statecat) throw Error("something wrong")
        res.status("200").json(statecat);
    } catch {
        res.status("400").json(statecat);
    }
})

//dellete state
app.delete("/api/deletestate/:id", async function (req, res) {
    try {
        const deletestate = await state.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletestate);
        }
        res.send(deletestate);
    } catch {
        res.status("400").json(deletestate);
    }
})

//insert city
app.post("/api/cityadd", [
    check('citys').isLength({ min: 3 }),
    check('states').isLength({ min: 3 })
], async (req, res) => {
    const { states, citys } = req.body;
    try {
        const cityadd = new city({
            states, citys
        });
        await cityadd.save();
        res.status("200").send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status("500").send("server error");
    }
});

//delete city
app.delete("/api/deletecityy/:id", async function (req, res) {
    try {
        const deletecitys = await city.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletecitys);
        }
        res.send(deletecitys);
    } catch {
        res.status("400").json(deletecitys);
    }
})

//all city display
app.get("/api/citydisp", async (req, res) => {
    const citycat = await city.find();
    try {
        if (!citycat) throw Error("something wrong")
        res.status("200").json(citycat);
    } catch {
        res.status("400").json(citycat);
    }
})

//insert property
app.post("/api/insertcategory", async (req, res) => {
    const { name } = req.body;
    try {
        const categorys = new category({
            name,
        });
        await categorys.save();
        const body = {
            success: true,
            message: 'successfully inserted',
            error: ''
        }
        res.status(200).send(body);
    } catch (err) {
        console.error(err.code);
        if (err.code == 11000) {
            const body = {
                success: false,
                error: `Duplicate data ${err.keyValue.name}`
            }
            res.status(400).send(body)
        } else {
            res.status(500).send("server error");
        }
    }
});

//all packages manage by admin
app.post("/api/packageadd", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, duration, no_of_ads, amount, description } = req.body;
    try {
        const packages = new package({
            name,
            duration,
            no_of_ads,
            amount,
            description,
        });
        await packages.save();
        const body = {
            success: true,
            message: 'successfully inserted',
            error: ''
        }
        res.status(200).send(body);
    } catch (err) {
        console.error(err.code);
        if (err.code == 11000) {
            const body = {
                success: false,
                error: `Duplicate data ${err.keyValue.name}`
            }
            res.status(400).send(body)
        } else {
            res.status(500).send("server error");
        }
    }
});

//display package
app.get("/api/packageDisplay", async (req, res) => {
    const pack = await package.find();
    try {
        if (!pack) throw Error("something wrong")
        res.status("200").json(pack);
    } catch {
        res.status("400").json(pack);
    }
})


//delete package
app.delete("/api/deletePackage/:_id", async function (req, res) {
    try {
        const deletepackage = await package.findByIdAndDelete(req.params._id);
        if (!req.params._id) {
            res.status("400").json(deletepackage);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletepackage);
    }
})



//display owner details on any  where 
app.get("/api/ownerDisplay", async (req, res) => {
    const ownerD = await Owner.find();
    try {
        if (!ownerD) throw Error("something wrong")
        res.status("200").json(ownerD);
    } catch {
        res.status("400").json(ownerD);
    }
})


//all propertys display
app.get("/api/propertyDisplay", async (req, res) => {
    const property = await Allproperty.find();
    try {
        if (!property) throw Error("something wrong")
        res.status("200").json(property);
    } catch {
        res.status("400").json(property);
    }
})


//all subcategory display
app.get("/api/subcategorydisp", async (req, res) => {
    const subcat = await subcategory.find();
    try {
        if (!subcat) throw Error("something wrong")
        res.status("200").json(subcat);
    } catch {
        res.status("400").json(subcat);
    }
})


//insert subcategory
app.post("/api/subcategoryadd", async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { names, category } = req.body;
    try {
        const subcategoryadd = new subcategory({
            names, category
        });
        await subcategoryadd.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//delete subcategory
app.delete("/api/deletesubcategory/:id", async function (req, res) {
    try {
        const deletesubcategory = await subcategory.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletesubcategory);
        }
        res.send(deletesubcategory);
    } catch {
        res.status("400").json(deletesubcategory);
    }
})


//insert subcategory
app.post("/api/categoryadd",auth, [
    check('name', 'is required').not().isLength({ min: 2, max: 50 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
        const categoryadd = new category({
            name,
        });
        await categoryadd.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});




//delete category api
app.delete("/api/deletcategory/:id", async function (req, res) {
    try {
        const deletecategory = await category.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletecategory);
        }
        res.send(deletecategory);
    } catch {
        res.status("400").json(deletecategory);
    }
})

//owner activate
app.put("/api/updateOwner/:id/status", async function (req, res) {
    try {
        const id = req.params.id
        Owner.findByIdAndUpdate({ _id: id }, { status: true })
        .exec((err, result) => {
            if (err) return console.log(err)
            res.json("successfully activated")
        }) 
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})

//update package 
app.put("/api/updatePackage/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const name = req.body.name
        const duration = req.body.duration
        const no_of_ads = req.body.no_of_ads
        const amount = req.body.amount
        const description = req.body.description

        package.findByIdAndUpdate({ _id: id }, { name ,duration,no_of_ads,amount,description})
        .exec((err, result) => {
            if (err) return console.log(err)
            res.json("successfully updated")
        }) 
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

//owner activate
app.put("/api/deactivateOwner/:id/status", async function (req, res) {
    try {
        const id = req.params.id
        Owner.findByIdAndUpdate({ _id: id }, { status: false })
        .exec((err, result) => {
            if (err) return console.log(err)
            res.json("successfully deactivated")
        }) 
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
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
    try {
        const deletepackage = await Owner.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletepackage);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletepackage);
    }
})

app.listen(port, () => {
    console.log("port success")
})