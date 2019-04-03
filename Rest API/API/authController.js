const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const mongoose = require("mongoose");


//Route: /api/users/login
//Method: Post
//body : Application/json {email: [email], password: [password]}
//response: 200 - signed JWT token

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    mongoose.connect("mongodb://localhost:27017/master", {useNewUrlParser: true}).then(() => {
        User.findOne({email: email}).then(user => {
            mongoose.connection.close();
            if(!user)
                res.status(404).json({err: "User not found"});
            else{
                if(password !== user.password)
                    res.status(401).json({err: "password does not match"});
                else{
                    let token = jwt.sign({id: user._id, username: user.username}, 
                                        "secret", {expiresIn: 86400});
                    res.status(200).json({msg: "Login Successful", token});
                }
            }
        })
        .catch(err => console.log(err));
    })
});

module.exports = router;
