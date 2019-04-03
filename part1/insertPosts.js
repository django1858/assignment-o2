const Post = require("../models/post");

module.exports = (userPosts) => {

    let result = new Array(userPosts.length);
    for(let i = 0; i < userPosts.length; i++){
        const newPost = new Post(userPosts[i]);
        result[i] = newPost.save();
    }
    console.log("Done Inserting Posts.")
    return Promise.all(result);
}




