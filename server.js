/******* Port & Database Setup *******

Set The Correct Port Number &
Database Configuration Before Running 

********* Localhost Profile *********/

var usePort = 3000;
var useDb = 'mongodb://localhost/nfcvt';

/***** Set Cryptography Algorithm ****/

var algorithm = 'aes-256-ctr';
var  password = 'd6F3Efeq';

/*************************************/

//Set The Modules To Be Used
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var sendgrid  = require('sendgrid')('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');
var url = require('url');
var crypto = require('crypto');
//var http = require('http');

//


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
    eventImageUrl: String,
    eventDate: String,
    eventAvailableTickets: Number,
    eventAttendance: Number,
    eventCheckedInCount: Number,
    eventCreatedByFirstName: String,
    eventCreatedByLastName: String,
    eventDescription: String,
    eventPublic: String,
    eventActivation: Boolean,
    eventLocationCountry: String,
    eventLocationArea: String,
    eventCategory: String,
    eventStartTime: String,
    eventFinishTime: String

}));

var Ticket = mongoose.model('Ticket', new Schema({
    id: ObjectId,
    ticketId: String,
    ticketOwnerFirstName: String,
    ticketOwnerLastName: String,
    ticketForEvent: String,
    ticketStatus: String

}));

var Message = mongoose.model('Message', new Schema({
    id: ObjectId,
    eventName: String,
    eventOrganiser: String,
    message: String,
    firstNameFrom: String,
    lastNameFrom: String,
    firstNameTo: String,
    lastNameTo: String

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

//Update The Event Information
app.post('/updateEvent', function(req, res) {

    Event.update(

        { eventName: req.body.eventNameOriginal}, 
            {$set: 
                { 
                    "eventName": req.body.eventName, 
                    "eventDate": req.body.eventDate,
                    "eventImageUrl": req.body.eventImageUrl,
                    "eventAvailableTickets": req.body.eventAvailableTickets,
                    "eventDescription": req.body.eventDescription,
                    "eventLocationCountry": req.body.eventLocationCountry,
                    "eventLocationArea": req.body.eventLocationArea,
                    "eventCategory": req.body.eventCategory,
                    "eventStartTime": req.body.eventStartTime,
                    "eventFinishTime": req.body.eventFinishTime
            }
        }, 

        function(err, tickets)  { 
        
            //res.json(tickets);
            if(!err)
            {
                console.log("Event Has Been Modified");
            }
            else
            {
                console.log("Event Has Not Been Modified");
            }
            
        }
    );    

});

//Remove User Ticket
app.post('/removeUserTicket', function(req, res) {

    console.log(req.body);

    Ticket.remove({ 

        ticketId: req.body.ticketId,
        ticketOwnerFirstName: req.body.ticketOwnerFirstName, 
        ticketOwnerLastName: req.body.ticketOwnerLastName

    }, function(err) {
        if (!err) {
            console.log("Ticket Was Sucessfully Removed");
        }
        else {
            console.log("Ticket Was Not Removed");
        }
    });

});

//Remove User Ticket
app.post('/removeEvent', function(req, res) {

    console.log(req.body);

    //Remove The Event
    Event.remove({ 
        eventName: req.body.eventName
    }, 

    function(err) {
        if (!err) {
            console.log("Event Was Sucessfully Removed");
        }
        else {
            console.log("Event Was Not Removed");
        }
    });

    //Update All Tickets To Removed
    

});

app.post('/sendUserFeedback', function(req, res) {

    console.log(req.body.name);
    console.log(req.body.email)
    console.log(req.body.message);

    sendgrid.send({
        
        to:       'daniel.rejniak@gmail.com',
        from:     req.body.email,
        subject:  'NFCVT User Feedback',
        text:     req.body.message

    }, function(err, json) 

    {
        if (err) { return console.error(err); }
        console.log(json);
    });

});

//Send User Message
app.post('/sendUserMessage', function(req, res) {

    var message = new Message ({

            eventName: req.body.eventName,
            eventOrganiser: req.body.eventOrganiser,
            message: req.body.message,
            firstNameFrom: req.session.user.firstName,
            lastNameFrom: req.session.user.lastName,
            firstNameTo: req.body.eventOrganiserFirstName,
            lastNameTo: req.body.eventOrganiserLastName

        });

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("ERROR: Failed To Send Message");
        }
        else {
            console.log("CREATED: Message Sent");
        }
    });

});

//Send Admin Message
app.post('/sendAdminMessage', function(req, res) {

    var message = new Message ({

            eventName: req.body.eventName,
            eventOrganiser: null,
            message: req.body.message,
            firstNameFrom: req.session.user.firstName,
            lastNameFrom: req.session.user.lastName,
            firstNameTo: req.body.firstNameTo,
            lastNameTo: req.body.lastNameTo

        });

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("ERROR: Failed To Send Message");
        }
        else {
            console.log("CREATED: Message Sent");
        }
    });

}); 

//Send User Replu
app.post('/sendUserReply', function(req, res) {

    console.log(req.body);

    var message = new Message ({

        eventName: req.body.event,
        eventOrganiser: null,
        message: req.body.message,
        firstNameFrom: req.session.user.firstName,
        lastNameFrom: req.session.user.lastName,
        firstNameTo: req.body.firstNameTo,
        lastNameTo: req.body.lastNameTo
    });

    console.log(message);

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("ERROR: Failed To Send Message");
        }
        else {
            console.log("CREATED: Message Sent");
        }
    });

}); 

//Get All The Tickets That Bellng To User
app.get('/getAllMyTickets', function(req, res) {

    Ticket.find({ ticketOwnerFirstName: req.session.user.firstName}, function(err, tickets)  {
       
    res.json(tickets);

    });

});

//Get Event Info For Dashboard
app.get('/getPublicEventInfo', function(req, res) {

    Event.find({ eventPublic: "true", eventActivation: true}, function(err, events)  {   
    res.json(events);

    });

});

//Count Events Of The Currently Logged In User
app.get('/countMyEvents', function(req, res) {

    Event.count({ eventCreatedByFirstName: req.session.user.firstName}, function(err, count)  { 
    console.log("Count My Events : " +count);
    res.json(count);

    });

});

//Count Events Of The Currently Logged In User That Are Active
app.get('/countMyActiveEvents', function(req, res) {

    Event.count({ eventCreatedByFirstName: req.session.user.firstName, eventActivation: true}, function(err, count)  { 
    console.log("Count Active Events : " +count);
    res.json(count);

    });

});


//Count Events Messages Relating To The User
app.get('/countMyMessages', function(req, res) {

    Message.count({ firstNameTo: req.session.user.firstName, lastNameTo: req.session.user.lastName}, function(err, count)  { 
    console.log("Count My Messages : " +count);
    res.json(count);

    });

});

//Display Evets Created By Logged In User
app.post('/getEventGuest', function(req, res) {

    console.log(req.body.eventName.split(' ').join(''));
    Ticket.find({ ticketForEvent: req.body.eventName.split(' ').join('')}, function(err, tickets)  { 
    res.json(tickets);

    console.log(tickets);

    });

});

//Activate The Event
app.post('/activateEvent', function(req, res) {

    Event.update({ eventName: req.body.eventName}, {$set: { "eventActivation": true }}, function(err, tickets)  { 
    //res.json(tickets);
    console.log("Event Activated");
    });

});

//Remove Admin Message
app.post('/removeAdminMessage', function(req, res) {

    Message.remove({ eventName: req.body.eventName, eventOrganiser: req.body.eventOrganiser, message: req.body.message}, function(err) {
        if (!err) {
            console.log("Message Was Sucessfully Removed");
        }
        else {
            console.log("Message Was Not Removed");
        }
    });

});

//Remove Admin Message
app.post('/removeUserMessage', function(req, res) {

    Message.remove({ eventName: req.body.eventName, eventOrganiser: req.body.eventOrganiser, message: req.body.message}, function(err) {
        if (!err) {
            console.log("Message Was Sucessfully Removed");
        }
        else {
            console.log("Message Was Not Removed");
        }
    });

});

//Activate The Event
app.post('/deactivateEvent', function(req, res) {

    Event.update({ eventName: req.body.eventName}, {$set: { "eventActivation": false }}, function(err, tickets)  { 
    //res.json(tickets);
    console.log("Event Deactivated");
    });

});

//Ban User From The Event
app.post('/banUser', function(req, res) {

    Ticket.update({ ticketId: req.body.ticketId}, {$set: { "ticketStatus": "Banned" }}, function(err, tickets)  { 
    //res.json(tickets);
    //console.log("banUser");
    //console.log(req.body.ticketId);
    });
});    

//Display Guests For Current Event
app.get('/displayMyEvents', function(req, res) {

    Event.find({ eventCreatedByFirstName: req.session.user.firstName }, function(err, events)  { 
    res.json(events);

    });

});

//Display All Messages Belonging To Admin
app.get('/displayAdminMessages', function(req, res) {


    Message.find({ firstNameTo: req.session.user.firstName, lastNameTo: req.session.user.lastName}, function(err, messages)  { 
    res.json(messages);

    });

});


//Display All Messages Belonging To User
app.get('/displayUserMessages', function(req, res) {

    Message.find({ firstNameTo: req.session.user.firstName, lastNameTo: req.session.user.lastName}, function(err, messages)  { 
    res.json(messages);

    });

});

//Create Event
app.post('/createTicket', function(req, res) {

        var ticketId = new Ticket ({
            ticketId: req.body.ticketId,
            ticketOwnerFirstName: req.body.ticketOwnerFirstName,
            ticketOwnerLastName: req.body.ticketOwnerLastName,
            ticketForEvent: req.body.ticketForEvent,
            ticketStatus: "Not Checked In"
        });

        console.log(req.body.ticketForEvent);

        //Check If Ticket Already Exists In The Database
        Ticket.findOne({ ticketOwnerFirstName: req.body.ticketOwnerFirstName, ticketOwnerLastName: req.body.ticketOwnerLastName, ticketForEvent: req.body.ticketForEvent}, function(err, ticket)
        {
            if(ticket != null)
            {
                console.log("Ticekt Exists");
                res.json({ created: false, exists: true });

            }
            else
            {
                console.log("Ticket Created");
                res.json({ created: true, exists: false });

                //Save To Database
                ticketId.save(function(err) {
        
                    if(err) {
                        console.log("ERROR: Failed To Create Ticket");
                    }
                    else 
                    {
                        
                    //Count All The Tickets For This Event
                    Ticket.count({ ticketForEvent: req.body.ticketForEvent }, function(err, count)  { 
                        
                        console.log("Count Attendance For Event : " +count);
                    
                        //Update The Evnet Information With The New Ticket
                        Event.update({ eventName: req.body.ticketForEvent}, {$set: { "eventAttendance": count }}, function(err, tickets)  { 
                            
                            //Message
                            console.log("Event " +req.body.ticketForEvent+ " Attendance Updatet To " +count);
                        });    

                        });
                    }
                });
            }
        });
    });    

//Create Event
app.post('/createEvent', function(req, res) {

    //Create Event Object To Store Event Info
    var event = new Event ({

        eventName: req.body.eventName.split(' ').join(''),
        eventImageUrl: req.body.eventImageUrl,
        eventDate: req.body.eventDate,
        eventAvailableTickets: req.body.eventAvailableTickets,
        eventAttendance: 0,
        eventCheckedInCount: 0,
        eventCreatedByFirstName: req.session.user.firstName,
        eventCreatedByLastName: req.session.user.lastName,
        eventDescription: req.body.eventDescription,
        eventPublic: "true",
        eventActivation: false,
        eventLocationCountry: req.body.eventLocationCountry,
        eventLocationArea: req.body.eventLocationArea,
        eventCategory: req.body.eventCategory,
        eventStartTime: req.body.eventStartTime,
        eventFinishTime: req.body.eventFinishTime

    });

    console.log(event);

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
//*** Encryption / Decryption Modules ****//
//****************************************//

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


//****************************************//
//********** ANDROID MODULES *************//
//****************************************//


//Android Module For User Sign In
app.get('/signinUrl', function(req, res) {


    //Sample Request : /signinUrl?username=daniel.rejniak@gmail.com&password=admin

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

                //Create User Session
                req.session.user = user;
                console.log(req.session.user);

                //Retrieve First Name & Last Name
                var firstName = req.session.user.firstName;
                var lastName = req.session.user.lastName;

                //Combine The User Details
                var combined = firstName+lastName+username;

                //Encrypt Session Code
                var sessionKey = encrypt(combined);
                
                //Json Respons With Validation & Session Code
                res.json({ verification: true, sessionKey: sessionKey });
            }
        }    
    })
});

//Android Module For Android Register
app.post('/createUserUrl' , function(req, res) {
    
    //Create User Object To Store Registration Info
    var user = new User ({
        firstName: req.query.firstName,
        lastName: req.query.lastName,
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

//Android Module To Utalise The Ticket From Wallet
app.get('/useTicketUrl' , function(req, res) {
    
    //Retrieve The Parameters Passed In The Url
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var eventName = req.query.eventName;

    /*Ticket.remove({ ticketOwnerFirstName: firstName, ticketOwnerLastName: lastName, ticketForEvent: eventName}, function(err) {
        if (!err) {
            console.log("Ticket Sucessfully Checked In");
            res.json({ verification: true, message: 'Authentication Passed. Ticket Checked In!!' });
        }
        else {
            console.log("Ticket Not Checked In");
            res.json({ verification: false, message: 'Authentication Failed. Ticket Not Checked In!!' });
        }
    }); */

    //Check In The User
    Ticket.update({ ticketOwnerFirstName: firstName , ticketOwnerLastName: lastName, ticketStatus: "Not Checked In"}, {$set: { "ticketStatus": "Checked In" }}, function(err)  { 
        if (!err) {
            console.log("Ticket Sucessfully Checked In");
            res.json({ verification: true, message: 'Authentication Passed. Ticket Checked In!!' });
        }
        else {
            console.log("Ticket Not Checked In");
            res.json({ verification: false, message: 'Authentication Failed. Ticket Not Checked In!!' });
        }
    });

    //Count All Checked In Users & Update Count
    Ticket.count({ ticketForEvent: eventName }, function(err, count)  { 
                
        //Update The Evnet Information With The New Ticket
        Event.update({ eventName: eventName}, {$set: { "eventCheckedInCount": count }}, function(err, tickets)  { 
            
        });
    });    
    //useTicketUrl?firstName=Daniel&lastName=Rejniak&eventName=DCUExpoPresentation
    
});

//Android Module Get All Tickets That Bellng To User
app.get('/getAllMyTicketsUrl', function(req, res) {

    var firstName = req.query.firstName;
    Ticket.find({ ticketOwnerFirstName: firstName}, function(err, tickets)  {
       
    res.json(tickets);

    //Sample Url To Retrieve User Ticekts
    //getAllMyTicketsUrl?firstName=Daniel    

    });

}); 

//Android Module Get Information About Event
app.get('/viewEventUrl', function(req, res) {

    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var eventName = req.query.eventName;
    var eventLocationCountry = req.query.eventLocationCountry;

    Event.find({ eventName: eventName, eventLocationCountry: eventLocationCountry}, function(err, event)  {
       
    res.json(event);

    //Sample Url To Retrieve User Ticekts
    //viewEventUrl?firstName=Daniel&lastName=Rejniak&eventName=..&eventLocationCountry=...    

    });

}); 

//Set The Listening Port
app.listen(usePort);

//Information Message 
console.log("Server Running, Using Port: " + usePort);
