/******* Port & Database Setup *******

Set The Correct Port Number &
Database Configuration Before Running 

********* Localhost Profile *********/

var usePort = 3000;
var useDb = 'mongodb://localhost/nfcvt';

/*************************************/

//Set The Modules To Be Used
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var url = require('url');
//var http = require('http');


//MongoDB Schema
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    password: String

}));

var Event = mongoose.model('Event', new Schema({
    id: ObjectId,
    eventName: String,
    eventLocation: String,
    eventDate: String,
    eventAvailableTickets: Number,
    eventCreatedBy: String,
    eventPublic: String

}));

var Ticket = mongoose.model('Ticket', new Schema({
    id: ObjectId,
    ticketId: String,
    ticketOwnerFirstName: String,
    ticketOwnerLastName: String,
    ticketForEvent: String

}));

//Conect To Mongo
mongoose.connect(useDb);

//Use The Index Page As Staring Point
app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());

//Cookie Setup Configuration
app.use(sessions({
    cookieName: 'session',
    secret: 'daefdsfxdsfxsdxfdsfxd',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,


}));

//****************************************//
//************* WEB MODULES **************//
//****************************************//

//Get User Info For Dashboard
app.get('/getUserInfo', function(req, res) {

    //console.log(req.session.user.firstName);
    res.json(req.session.user);

});

//Get All The Tickets That Bellng To User
app.get('/getAllMyTickets', function(req, res) {

    Ticket.find({ ticketOwnerFirstName: req.session.user.firstName}, function(err, tickets)  {
       
    res.json(tickets);

    });

});

//Get Event Info For Dashboard
app.get('/getPublicEventInfo', function(req, res) {

    Event.find({ eventPublic: "true"}, function(err, events)  {
       
    res.json(events);

    });

});

//Create Event
app.post('/createTicket', function(req, res) {

        console.log(req.body.ticketInfo);

        var ticketId = new Ticket ({
            ticketId: req.body.ticketId,
            ticketOwnerFirstName: req.body.ticketOwnerFirstName,
            ticketOwnerLastName: req.body.ticketOwnerLastName,
            ticketForEvent: req.body.ticketForEvent
        });

        //Save To Database
        ticketId.save(function(err) {
        if(err) {
            console.log("ERROR: Failed To Create Ticket");
        }
        else {
            console.log("CREATED: Ticket Added To DB");
        }
    });
});

//Create Event
app.post('/createEvent', function(req, res) {

    //Create Event Object To Store Event Info
    var event = new Event ({

        eventName: req.body.eventName,
        eventLocation: req.body.eventLocation,
        eventDate: req.body.eventDate,
        eventAvailableTickets: req.body.eventAvailableTickets,
        eventCreatedBy: req.session.user.firstName,
        eventPublic: "true"
    });

    //Save To Database
    event.save(function(err) {
        if(err) {
            console.log("ERROR: Failed To Create Event");
        }
        else {
            console.log("CREATED: Event Added To DB");
        }
    });

});


//Login
app.post('/signin' , function(req, res) {
    

    User.findOne({ username: req.body.username }, function(err, user) {

        if (err) throw err;

        //If No User Exists
        if(!user) {

            console.log("VERIFIED: Failed");
            res.json({ success: false, message: 'Authentication failed. Wrong password or Username!!' });
        }
        else {

            if(user.username == req.body.username && user.password == req.body.password) {

                console.log("VERIFIED: User Credentials");
                console.log("CREATED: User Session");
                req.session.user = user;
                console.log(req.session.user);
                res.json({ success: true, message: 'Authentication successfull. You Are Now Redirected To Dashboard!!'});
            }
        }    
    })
});
    
    

//Register
app.post('/createUser' , function(req, res) {
    
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
            console.log("ERROR: Can't Register User");
        }
        else {
            console.log("CREATED: User Is Now Registered");
        }
    });
    
});

//****************************************//
//********** ANDROID MODULES *************//
//****************************************//


//Android Module To Sign In
app.get('/signinUrl', function(req, res) {

    //Retrieve The Parameters Passed In The Url
    var username = req.query.username;
    var password = req.query.password;


    User.findOne({ username: username}, function(err, user) {

        if (err) throw err;

        //If No User Exists
        if(!user) {

            console.log("VERIFIED: Failed");
            res.json({ verification: false, message: 'Authentication failed. Wrong password or Username!!' });
        }
        else {

            if(user.username == username && user.password == password) {

                console.log("VERIFIED: User Credentials");
                console.log("CREATED: User Session");
                req.session.user = user;
                console.log(req.session.user);
                res.json({ verification: true, firstName: req.session.user.firstName, lastName: req.session.user.lastName, username: req.session.user.username});
            }
        }    
    })
});

//
app.post('/createUserUrl' , function(req, res) {
    
    //Create User Object To Store Registration Info
    var user = new User ({
        firstName: req.query.firstName;
        lastName: req.query.lastName;
        username: req.query.username,
        password: req.query.password
    });

    //Save To Database
    user.save(function(err) {
        if(err) {
            console.log("ERROR: Can't Register User From Mobile Device");
        }
        else {
            console.log("CREATED: User Is Now Registered From Mobile Device");
        }
    });
    
});

//Set The Listening Port
app.listen(usePort);

//Information Message 
console.log("Server Running, Using Port: " + usePort);
