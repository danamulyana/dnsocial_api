const router = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/User');


// register
router.post("/register", async (req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status:"Internal Server Error",
            errStatus : err
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
});

// login
router.post('/login', async (req,res) => {
    try{
        const user = await User.findOne({email: req.body.email});
    
        !user && res.status(404).json({statusCode: 404 , status:"User not found"});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json({statusCode: 400 , status:"Wrong password!"})

        res.status(200).json(user);
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status:"Internal Server Error",
            errStatus : err
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
})

module.exports = router;