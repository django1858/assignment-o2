const axios = require("axios");

async function getAllData(){

    let users = axios.get("https://jsonplaceholder.typicode.com/users");
    let posts = axios.get("https://jsonplaceholder.typicode.com/posts");
    let comments = axios.get("https://jsonplaceholder.typicode.com/comments");

    return await Promise.all([users, posts, comments]);

}

module.exports = getAllData;

