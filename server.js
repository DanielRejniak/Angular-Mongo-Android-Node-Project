//Set The Modules To Be Used
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('nfcvt' , ['nfcvt']);


//Use The Index Page As Staring Point
app.use(express.static(__dirname + "/"))
app.use(bodyParser.json());

//Login
app.post('/signin' , function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;

    var loginInfo = {username: username, password: password};
    

    db.nfcvt.find(loginInfo,function(err, docs) {

           console.log(docs);

        });
});
    
    

//Register
app.post('/signup' , function(req, res) {
    
    //Respond With The Body Passed By Controller
    console.log(req.body.username);
    
    //Insert Data Passed By Controller To DB
    db.nfcvt.insert(req.body);
    
});

//Set The Listening Port
app.listen(3000);

//Information Message 
console.log("Server Running On http://localhost:3000"); 