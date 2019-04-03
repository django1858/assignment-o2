const mongoose = require("mongoose");
const data = require("./FetchData")();
const User = require("../models/user");
const insertUsers = require("./insertUsers");
const insertPosts = require("./insertPosts");

data.then(fetchedData => {
    
    const users = fetchedData[0].data;
    const posts = fetchedData[1].data;
    const comments = fetchedData[2].data;
    let groupedComments = new Array(posts.length).fill(new Array(0));
    let groupedPosts = new Array(users.length).fill(new Array(0));
    
    for(let i = 0; i < comments.length; i++)  // grouping comments based on posts
        groupedComments[comments[i].postId-1] = [...groupedComments[comments[i].postId-1],comments[i]];

    for(let i = 0; i < posts.length; i++)
        posts[i].comments = groupedComments[i];

    users.map(user => {
        user._id = user.id;
        user.password =  "12345"
    });
    
    posts.map(post => post._id = post.id);

    mongoose.connect("mongodb://localhost:27017/master", {useNewUrlParser: true})
    .then(() => insertUsers(users))
    .then((users) => mongoose.connection.close())
    .catch(err => console.log());

    for(let i = 0; i < posts.length; i++)  // grouping comments based on posts
        groupedPosts[posts[i].userId-1] = [...groupedPosts[posts[i].userId-1], posts[i]];

    for(let i = 0; i < groupedPosts.length; i++){
        mongoose.connect("mongodb://localhost:27017/user" + i, {useNewUrlParser: true})
        .then(() => insertPosts(groupedPosts[i]))
        .then((posts) => mongoose.connection.close())
        .catch(err => console.log(err));
    }
})
.catch(err => console.log(err));

