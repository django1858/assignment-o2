# assignment-o2

clone the project and run "npm install" to download dependencies

Part 1:
  To run Part 1, execute script.js file "node part1/script.js".
  
  FetchData.js file contains script to fetch details from external API.
   
  script.js populates the database running on the localhost.
  
Part 2:
  
  To run part2, run "npm start" from project root.
  
  The following are the routes.
  
  File: authController.js
  Route: /api/users/login
  desc: sends a jwt token as response after validation
  Method: POST
  Body and content type: application/json with email and password {email:[email], password: [password]}  
  
  
  
  The following routes requires the JWT token to be sent in the request header with key of "x-access-token".
  
  
  File: usersController.js
  Route: /api/users/all
  desc: sends array of users details as response
  Method: GET
  
  File: usersController.js
  Route: /api/users/:user_id/posts
  desc: sends array of posts made by the user user_id as response
  Method: GET
  
  File: usersController.js
  Route: /api/users/upload
  desc: logged in user could update the image.
  Body: Image sent as form-data with key name of "profilePic"
  Method: PUT
  

