const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Post = require("../../models/post");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Profile Pics");
    },
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
    cb(null, true);
   else
    cb(new Error("Invalid image format"), false);
}
const upload = multer({storage, fileFilter});

//Route: /api/users/all
//desc: sends array of users details as response
//Method: GET
//x-access-token: JWT token
router.get("/all", (req, res) => {

    const token = req.headers["x-access-token"];
    if(token){
        jwt.verify(token, "secret", (err) => {
            if(err)
                res.status(401).json({err: "Invalid Token"});
            else{
                mongoose.connect("mongodb://localhost:27017/master", {useNewUrlParser: true}).then(() => {
                    User.find({}).select("name email address").exec().then(users => {
                        mongoose.connection.close();
                        res.status(200).json({users});
            }).catch(err => console.log(err));
        });
    }
});
    }
    else
        res.status(401).json({err: "Token not found"})
});

//Route: /api/users/:user_id/posts
//method: GET
//response: array of posts by User with id 'user_id' 
//x-access-token: JWT token of logged in user

router.get("/:id/posts", (req, res) => {
    
    const id = req.params.id;
    const token = req.headers["x-access-token"];
    if(token){
        jwt.verify(token, "secret", (err) => {
            if(err)
                res.status(401).json({err: "Invalid Token"});
            else{
                mongoose.connect("mongodb://localhost:27017/master", {useNewUrlParser: true}).then(() => {
                    User.findById(id).then((user) =>{
                        mongoose.connection.close();
                        if(!user) res.status(403).json({err: "User not found"});
                        else{
                            mongoose.connect("mongodb://localhost:27017/user" + (parseInt(id)-1), {useNewUrlParser: true}).then(() => {
                                Post.find({}).then((posts) => {
                                    mongoose.connection.close();
                                    res.status(200).json({posts});
                                });
                        });
                    }
                });
            });
        }
    });
}
else 
    res.status(401).json({err: "Invalid token"})
});

//Router: /api/users/upload
//method: PUT
//desc: logged in users can change their profile picture
//x-access-token: JWT token of logged in user
//image sent as form-data with "profilePic" as Key and image as Value

router.put("/upload", upload.single("profilePic"), (req, res) => {
    const token = req.headers["x-access-token"];
    if(token){
        jwt.verify(token, "secret", (err, decoded) => {
            if(err)
                res.status(401).json({err: "Invalid Token"});
            else{
                if(req.file === undefined) res.status(400).send({err: "Invalid image"});
                const id = decoded.id;
                mongoose.connect("mongodb://localhost:27017/master", {useNewUrlParser: true}).then(() => {
                    User.findById(id).then(user => {
                        console.log("Found");
                        if(user.profilePicture !== undefined) 
                            try{
                                fs.unlinkSync(user.profilePicture);
                            }
                            catch(err){
                                user.profilePicture = undefined;
                            }
                        user.profilePicture = req.file.path;
                        User.findOneAndUpdate({_id:id}, {$set: user}, {new: true}).then(user => {
                            mongoose.connection.close();
                            res.status(200).json(user);
                        })
                    })
                }).catch(err => console.log(err));
            } 
        });
    }
    else
        res.status(401).send({err: "Invalid token"});
});

module.exports = router;