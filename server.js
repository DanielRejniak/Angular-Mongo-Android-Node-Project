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
app.get('/loginInfo', function(req, res) {
    console.log("I recieved a GET request from controller.js ");
    
    person1 = {
        usernameInfo: 'admin',
        passwordInfo: 'admin'
        
    };
    
    db.nfcvt.find(function(err, docs) {
        
        //Respond With Content From The Database 
        console.log("Response For Database");
        console.log(docs);
    })
    
    var personalInfo = [person1];
    res.json(personalInfo);
    
    
});

//Register
app.post('/signup' , function(req, res) {
    
    //Respond With The Body Passed By Controller
    console.log(req.body)
    
    //Insert Data Passed By Controller To DB
    db.nfcvt.insert(req.body);
    
});

//Set The Listening Port
app.listen(3000);

//Information Message 
console.log("Server Running On http://localhost:3000"); 