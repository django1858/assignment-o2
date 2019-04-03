const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const post = new Schema({
    _id: {type: Number, required: true},
    userId: {type: Number, required:true},
    title: {type:String, required: true},
    body:{type: String, required: true},
    comments: [{
        name: {type: String, required: true},
        email: {type: String, required: true},
        body: {type: String, required: true}
    }]
});

module.exports = mongoose.model("Post", post);
