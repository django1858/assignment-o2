const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type:String},
    address: {
      street: {type: String},
      suite: {type: String},
      city: {type: String},
      zipcode:{type: String},
      geo: {
        lat: {type: String},
        lng: {type: String, required: true}
      }
    },
});

module.exports = mongoose.model("User", user);
