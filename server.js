//Set The Modules To Be Used
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    password: String

}));

//Conect To Mongo
mongoose.connect('mongodb://localhost/nfcvt');

//Use The Index Page As Staring Point
app.use(express.static(__dirname + "/"))
app.use(bodyParser.json());

//Login
app.post('/signin' , function(req, res) {
    
    User.findOne({ username: req.body.username }, function(err, user) {

        if (err) throw err;

        //If No User Exists
        if(!user) {

            console.log("ERROR - No Such User Exists");
            res.json({ success: false, message: 'Authentication failed. Wrong password or Username!!' });
        }
        else {

            if(user.username == req.body.username && user.password == req.body.password) {

                console.log("VERIFIED - User Credentials Valid");
                res.json({ success: true, message: 'Authentication successfull. You Are Now Redirected To Dashboard!!'});
            }
        }    
    })
});
    
    

//Register
app.post('/signup' , function(req, res) {
    
    //Create User Object To Store Registration Info
    var user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    });

    //Save To Database
    user.save(function(err) {
        if(err) {
            console.log("ERROR - Cant Register The User");
        }
        else {
            console.log("CREATED - User Is Now Registered");
        }
    });
    
});

//Set The Listening Port
app.listen(3000);

//Information Message 
console.log("Server Running On http://localhost:3000"); 