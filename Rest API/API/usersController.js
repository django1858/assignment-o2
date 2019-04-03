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
//response: array of users
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
});

//Route: /api/users/:user_id/posts
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
});

router.post("/upload", upload.single("profilePic"), (req, res) => {
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
                        if(user.profilePicture !== undefined) 
                            fs.unlinkSync(user.profilePicture);
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
});

module.exports = router;