const User = require("../models/user");

module.exports = (users) => {

    let result = new Array(users.length);
    for(let i = 0; i < users.length; i++){
        const newUser = new User(users[i]);
        result[i] = newUser.save();
    }
    console.log("Done Inserting Posts.")
    return Promise.all(result);
}

