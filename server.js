//Set The Modules To Be Used
var express = require('express');
var app = express();

//Use The Index Page As Staring Point
app.use(express.static(__dirname + "/"))


app.get('/loginInfo', function(req, res) {
    console.log("I recieved a GET request from controller.js ");
    
    person1 = {
        usernameInfo: 'admin',
        passwordInfo: 'admin'
        
    };
        
    var personalInfo = [person1];
    res.json(personalInfo);
    
    
});

//Set The Listening Port
app.listen(80, '127.0.0.1');
console.log("Server Running On http://localhost:3000"); 