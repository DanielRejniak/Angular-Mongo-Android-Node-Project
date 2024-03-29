/******* Port & Database Setup *******

Set The Correct Port Number &
Database Configuration Before Running 

********* Settings *********/

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
var colors = require('colors');

//MongoDB Schema
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    sessionKey: String,
    activationKey: String,
    activation: Boolean,

}));

var EntryKeys = mongoose.model('EntryKeys', new Schema({
    id: ObjectId,
    entryKey: String,
    status: Boolean

}));

var Event = mongoose.model('Event', new Schema({
    id: ObjectId,
    eventPublicId: String,
    eventPrivateId: String,
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
    eventFinishTime: String,
    eventCreatorSessionKey: String

}));

var Ticket = mongoose.model('Ticket', new Schema({
    id: ObjectId,
    ticketId: String,
    ticketOwnerEmail: String,
    ticketOwnerFirstName: String,
    ticketOwnerLastName: String,
    ticketForEvent: String,
    ticketStatus: String,
    ticketRequestEntryCode: String,
    ticketEventId: String,
    ticketUserSession: String

}));

var Message = mongoose.model('Message', new Schema({
    id: ObjectId,
    about: String,
    message: String,
    firstNameFrom: String,
    lastNameFrom: String,
    senderSessionKey: String,
    recieverSessionKey: String

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
    duration: 30 * 60 * 100000,
    activeDuration: 5 * 60 * 100000,


}));

//****************************************//
//************* WEB MODULES **************//
//****************************************//



//Get User Info For Dashboard
app.get('/getUserInfo', function(req, res) {

    //console.log(req.session.user.firstName);
    res.json(req.session.user);

});

//Get User Info For Dashboard
app.get('/destroySession', function(req, res) {

    //console.log(req.session.user.firstName);
    console.log("Log :" + colors.green("Destroying Session"));
    req.session.destroy();

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
                console.log("Log :" + colors.green("Event Updated"));
            }
            else
            {
                console.log("Log :" + colors.red("Failed To Update"));
            }
            
        }
    );    

});

//Remove User Ticket
app.post('/removeUserTicket', function(req, res) {

    Ticket.remove({ 

        ticketUserSession: req.session.user.sessionKey,
        ticketEventId: req.body.ticketEventId


    }, function(err) {
        if (!err) {

            console.log("Log :" + colors.green("Removing Ticket"));

            //Remove The Key Asociated With THe Ticket
            //Extract The Event Info Based On The Event Public Id
            Event.findOne({ eventPublicId: req.body.ticketEventId }, function(err, event) {

                //Id Event found
                if(!err)
                {
                    //Extract The Private Id Of The Event
                    var priv = event.eventPrivateId;
                    var ses = req.session.user.sessionKey;

                    //Combine The Private Event Key With User Session Key
                    var entryKey = encrypt(priv+ses);


                    //If Error Remove User
                    EntryKeys.remove({ entryKey: entryKey },function(err) {

                        if(err) {

                            //If No Error Pass
                            console.log("Log :" + colors.red("Failed To Remove Entrykey")); 
                        }
                        else
                        {
                            //If No Error Pass
                            console.log("Log :" + colors.green("Removing Entrykey"));
                        }
                    });

                }
                else {
                    console.log("Log :" + colors.red("Failed To Remove Ticket"));
                }
            });
        }
    }        
);
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
            console.log("Log :" + colors.green("Event Removed"));
        }
        else {
            console.log("Log :" + colors.green("Faield To Remove The Event"));
        }
    });

    //Update All Tickets To Removed
    

});

//Send User Feedbakc To My Email Form The Main Page
app.post('/sendUserFeedback', function(req, res) {

    sendgrid.send({
        
        to:       'daniel.rejniak@gmail.com',
        from:     req.body.email,
        subject:  'NFCVT User Feedback',
        text:     req.body.message

    }, function(err, json) 

    {
        if (err) { return console.error(err); }
        console.log("Log :" + colors.green("User Feedback Sent"));
    });

});

//Send User Message
app.post('/sendMessage', function(req, res) {

    var message = new Message ({

            about: req.body.about,
            message: req.body.message,
            firstNameFrom: req.session.user.firstName,
            lastNameFrom: req.session.user.lastName,
            senderSessionKey: req.session.user.sessionKey,
            recieverSessionKey: req.body.recieverSessionKey

        });

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("Log :" + colors.red("Failed To Send Message"));
        }
        else {
            console.log("Log :" + colors.green("Message Sent"));
        }
    });

});

//Send Message Generated By The Organiser
app.post('/sendUserMessage', function(req, res) {

    var message = new Message ({

            about: req.body.about,
            message: req.body.message,
            firstNameFrom: req.session.user.firstName,
            lastNameFrom: req.session.user.lastName,
            senderSessionKey: req.session.user.sessionKey,
            recieverSessionKey: req.body.recieverSessionKey

        });

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("Log :" + colors.red("Failed To Send Message"));
        }
        else {
            console.log("Log :" + colors.green("Message Sent"));
        }
    });

});

//Send User Reply
app.post('/sendUserReply', function(req, res) {

    var message = new Message ({

        about: req.body.about,
        message: req.body.message,
        firstNameFrom: req.session.user.firstName,
        lastNameFrom: req.session.user.lastName,
        senderSessionKey: req.session.user.sessionKey,
        recieverSessionKey: req.body.recieverSessionKey
    });

    //Send Message
    message.save(function(err) {
        if(err) {
            console.log("Log :" + colors.red("Failed To Send Reply"));
        }
        else {
            console.log("Log :" + colors.green("Reply Sent"));
        }
    });

}); 

//Get All The Tickets That Bellng To Logged In User
app.get('/getAllMyTickets', function(req, res) {

    Ticket.find({ ticketOwnerFirstName: req.session.user.firstName, ticketOwnerLastName: req.session.user.lastName, ticketUserSession: req.session.user.sessionKey}, function(err, tickets)  {
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

    Event.count({ eventCreatorSessionKey: req.session.user.sessionKey }, function(err, count)  { 
    res.json(count);

    });

});

//Count Events Of The Currently Logged In User That Are Active
app.get('/countMyActiveEvents', function(req, res) {

    Event.count({ eventCreatorSessionKey: req.session.user.sessionKey, eventActivation: true}, function(err, count)  { 
    res.json(count);

    });

});


//Count Events Messages Relating To The User
app.get('/countMyMessages', function(req, res) {

    Message.count({ recieverSessionKey: req.session.user.sessionKey }, function(err, count)  { 
    res.json(count);

    });

});

//Display Evets Created By Logged In User
app.post('/getEventGuest', function(req, res) {

    Ticket.find({ ticketForEvent: req.body.eventName}, function(err, tickets)  { 
    res.json(tickets);

    });

});

//Activate The Event
app.post('/activateEvent', function(req, res) {

    Event.update({ eventName: req.body.eventName}, {$set: { "eventActivation": true }}, function(err, tickets)  { 
    //res.json(tickets);
    console.log("Log :" + colors.green("Event Activated"));
    });

});


//Remove User Message
app.post('/removeUserMessage', function(req, res) {

    Message.remove({ 
        recieverSessionKey: req.session.user.sessionKey,
        message: req.body.message
    }, 

    function(err) {
        if (!err) {
            console.log("Log :" + colors.green("Message Removed"));
        }
        else {
            console.log("Log :" + colors.red("Failed To Remove Message"));
        }
    });

});

//Activate The Event
app.post('/deactivateEvent', function(req, res) {

    Event.update({ eventName: req.body.eventName}, {$set: { "eventActivation": false }}, function(err, tickets)  { 
    //res.json(tickets);
    console.log("Log :" + colors.green("Event Deactivated"));
    });

});

//Ban User From The Event
app.post('/banUser', function(req, res) {

    Ticket.update({ ticketId: req.body.ticketId}, {$set: { "ticketStatus": "Banned" }}, function(err, tickets)  { 
        console.log("Log :" + colors.green("User Banned"));
    });
});    

//Display Guests For Current Event
app.get('/displayMyEvents', function(req, res) {

    Event.find({ eventCreatorSessionKey: req.session.user.sessionKey }, function(err, events)  { 
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

    Message.find({ recieverSessionKey: req.session.user.sessionKey }, function(err, messages)  { 
    res.json(messages);

    });

});

//Create Event
app.post('/createTicket', function(req, res) {
        

        //console.log(req.body.ticketEventPublicId);
        var userSession = req.session.user.sessionKey;
        var priv = req.body.ticketEventPrivateId;
        var entryKeyEnc = encrypt(priv+userSession);

        var ticketId = new Ticket ({
            ticketId: req.body.ticketId,
            ticketEventId: req.body.ticketEventPublicId,
            ticketOwnerEmail: req.session.user.username,
            ticketOwnerFirstName: req.body.ticketOwnerFirstName,
            ticketOwnerLastName: req.body.ticketOwnerLastName,
            ticketForEvent: req.body.ticketForEvent,
            ticketStatus: "Not Checked In",
            ticketRequestEntryCode: null,
            ticketUserSession: userSession
            
        });

        
        //Check If Ticket Already Exists In The Database
        Ticket.findOne({ ticketOwnerFirstName: req.body.ticketOwnerFirstName, ticketOwnerLastName: req.body.ticketOwnerLastName, ticketEventId: req.body.ticketEventPublicId}, function(err, ticket)
        {
            if(ticket != null)
            {
                console.log("Log :" + colors.red("Ticket Already Exists"));
                res.json({ created: false, exists: true });

            }
            else
            {
                console.log("Log :" + colors.green("New Ticket Created"));
                res.json({ created: true, exists: false });

                //Save To Database
                ticketId.save(function(err) {
        
                    if(err) {
                        console.log("Log :" + colors.red("Failed To Create Ticket"));
                    }
                    else 
                    {
                        //Add The Entry Key
                         var key = new EntryKeys ({

                            entryKey: entryKeyEnc,
                            status: false
                         });

                        key.save(function(err) {

                            if(err) {
                                console.log("Log :" + colors.red("Entry Key Not Created"));

                            }
                            else
                            {
                                console.log("Log :" + colors.green("New Entry Key Created"));
                            }
                        });

                        //Count All The Tickets For This Event
                        Ticket.count({ ticketForEvent: req.body.ticketForEvent }, function(err, count)  { 
                    
                        //Update The Evnet Information With The New Ticket
                        Event.update({ eventName: req.body.ticketForEvent}, {$set: { "eventAttendance": count }}, function(err, tickets)  { 
                            
                        });    

                        });
                    }
                });
            }
        }); 
    });    

//Create Event
app.post('/createEvent', function(req, res) {

    //Create Unique Event Id
    var random = getRandomInt(1,100000000000000000);

    //Extract User Info
    var creatorFirstName= req.session.user.firstName;
    var creatorLastName = req.session.user.lastName;

    //Combine Random Number With User Id & Encrypt
    var uniqueId = encrypt(random+creatorFirstName+creatorLastName);

    var privateRand = getRandomInt(1,100000000000000000)
    var privateId = encrypt(privateRand.toString());

    //Create Event Object To Store Event Info
    var event = new Event ({

        eventPublicId: uniqueId,
        eventPrivateId: privateId,
        eventName: req.body.eventName,
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
        eventFinishTime: req.body.eventFinishTime,
        eventCreatorSessionKey: req.session.user.sessionKey

    });

    console.log(event);


    //Save To Database
    event.save(function(err) {
        if(err) {
            console.log("Log :" + colors.red("Failed To Create Event"));
        }
        else {
            console.log("Log :" + colors.green("New Event Created"));
        }
    });

});


//Login
app.post('/signin' , function(req, res) {
    

    User.findOne({ username: req.body.username }, function(err, user) {

        if (err) throw err;

        //If No User Exists
        if(!user) {

            console.log("Log :" + colors.red("No Such Email Exists"));
            res.json({ success: false, message: 'Invalid Email' });
        }
        else {

            //Get Encrypted Password Form Db & Decrypt
            //var decrypted = decrypt(user.password);

            if(user.username == req.body.username && decrypt(user.password) == req.body.password) {

                //Check If User Activated Thier Account
                if(user.activation != true) {

                    console.log("Log :" + colors.red("Account Not Activated"));
                    res.json({ success: false, message: 'Activate Account'});
                }
                else {

                    req.session.user = user;
                    console.log("Log :" + colors.green("User Authorised"));
                    var welcomeMessage = "Welcome, "+ user.firstName
                    res.json({ success: true, message: welcomeMessage});
                } 
            }
            else {

                res.json({ success: false, message: 'Wrong Password'});
                console.log("Log :" + colors.red("Wrong Password")); 
            }
        }    
    })
});
    
//Generate Random Number 
    function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Register & Activation Generation
app.post('/createUser' , function(req, res) {
    
    //Create User Object To Store Registration Info
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.username;

    
    //Check If Email Exists In NFCVT Database
    User.findOne({ username: email}, function(err, user) {

        if(user != null)
        {   
            //If Email Exists Retrun False Status & Message
            res.json({ message: 'Email Exists', status: false});
            console.log("Log :" + colors.green("Email Already Existst")); 
        }
        else
        {
            //If Email Does Not Exists Begin Registration Process

            //Generate Randome Code For Activation
            var code = getRandomInt(1,1000000);

            //Combine The User Details For Session Key
            var combined = firstName+lastName+email;

            //Encrypt Session Key
            var sessionKey = encrypt(combined);

            //Encrypt Password
            var password = encrypt(req.body.password);

            //Create MongoDb User Object
            var user = new User ({
                firstName: firstName,
                lastName: lastName,
                username: email,
                password: encrypt(req.body.password),
                sessionKey: sessionKey,
                activationKey: code,
                activation: false
            });

            //Save User To Database
            user.save(function(err) {
            
                //Check Db Status
                if(err) {

                    res.json({ message: 'Cant Registering', status: false }); 
                    console.log("Log :" + colors.red("Unable To Register User"));
                }
                else {

                    //Send Email With The Code
                    sendgrid.send({
                        
                        to:       req.body.username,
                        from:     'NFCVT',
                        subject:  'NFCVT Email Verification',
                        text:     'Hi ' +req.body.firstName+ ', \n Your activation code \n \n' +user.activationKey+ '\n \n NFCVT Team'

                    }, function(err, json) 

                    {
                        if(err) 
                        { 
                            //If Error Remove User
                            User.remove({ firstName: req.body.firstName, lastName: req.body.lastName, username: email },function(err) {

                                if(err) {

                                    //If No Error Pass
                                    res.json({ message: 'Try Again', status: false });
                                    console.log("Log :" + colors.red("User Data Removed, Try Again"));    
                                }
                                else
                                {
                                    //If No Error Pass
                                    res.json({ message: 'Error', status: true });
                                    console.log("Log :" + colors.green("Failed To Send Reply")); 
                                }
                            });

                        }
                        else
                        {
                            //If No Error Pass
                            res.json({ message: 'Registered', status: true });
                            console.log("Log :" + colors.green("User Registered")); 
                        }
                        
                    });
                }
            
            });
        }
    });  
});

//Activate The User Account 
app.post('/activateMyAccount', function(req, res) {

    //Sample Url : /activateMyAccountUrl?code=

    //console.log(req.body.code);
    var code = req.body.code;

    User.update({ activationKey: code }, {$set: { "activation": true }}, function(err)  { 
       
        console.log(err);
    });

    User.findOne({ activationKey: code, activation: true}, function(err, user) {

        if(user != null)
        {
            res.json({ activated: true });
            console.log("Log :" + colors.green("Acount Activated")); 
        }
        else
        {
            res.json({ activated: false });
            console.log("Log :" + colors.red("Acount Failed To Activate")); 
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


//Login
app.get('/signinUrl' , function(req, res) {
    

    //Sample Request : /signinUrl?username=daniel.rejniak@gmail.com&password=admin

    //
    //Retrieve The Parameters Passed In The Url
    var usernameVar = req.query.username;
    var passwordVar = req.query.password;

    User.findOne({ username: usernameVar }, function(err, user) {

        if (err) throw err;

        //If No User Exists
        if(!user) {

            console.log("Log :" + colors.red("No User Email Exists")); 
            res.json({ success: false, message: 'Invalid Email', sessionKey: null});
        }
        else {

            //Get Encrypted Password Form Db & Decrypt
            //var decrypted = decrypt(user.password);

            if(user.username == usernameVar && decrypt(user.password) == passwordVar) {

                //Check If User Activated Thier Account
                if(user.activation != true) {

                    console.log("Log :" + colors.red("Account Not Activated")); 
                    res.json({ success: false, message: 'Activate Account', sessionKey: null});
                }
                else {

                    req.session.user = user;
                    console.log("Log :" + colors.green("Credentials Authorised")); 
                    var welcomeMessage = "Welcome, "+ user.firstName
                    res.json({ success: true, message: welcomeMessage, sessionKey: req.session.user.sessionKey});
                } 
            }
            else {

                res.json({ success: false, message: 'Wrong Password', sessionKey: null});
                console.log("Log :" + colors.red("Wrong Password")); 
            }
        }    
    })
});

//Get User Info Based On sessionKey
app.get('/sessionRetrieveUrl', function(req, res) {

    //Sample Request : /sessionRetrieveUrl?sessionKey=

    //Retrieve The Parameters Passed In The Url
    var sessionKey = req.query.sessionKey;

    //Get User Info From Session Key
    User.findOne({ sessionKey: sessionKey}, function(err, user) {

        //Json Respons With Validation & Session Code
        res.json({ firstName: user.firstName, lastName: user.lastName, email: user.username});
    });    


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
            console.log("Can't Register User From Mobile Device");
        }
        else {
            console.log("User Is Now Registered From Mobile Device");
        }
    });
    
});

//Android Module To Utalise The Ticket From Wallet
/*app.get('/useTicketUrl' , function(req, res) {
    
    //Retrieve The Parameters Passed In The Url
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var eventName = req.query.eventName;

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
    
}); */

//Android Module To Utalise The Ticket From Wallet
app.get('/useTicketUrl' , function(req, res) {

    //Sample Url Call : /useTicketUrl?firstName=&lastName=&ticketEventId=&userSessionKey=

    //Url Params
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var ticketEventId = req.query.ticketEventId;
    var userSessionKey = req.query.userSessionKey;

    //Extract The Event Info Based On The Event Public Id
    Event.findOne({ eventPublicId: ticketEventId }, function(err, event) {

        //Id Event found
        if(!err)
        {
            //Extract The Private Id Of The Event
            var priv = event.eventPrivateId;

            //Combine The Private Event Key With User Session Key
            var entryKey = encrypt(priv+userSessionKey);

            //Extract The Coresponding Entry Key
            EntryKeys.findOne({ entryKey: entryKey }, function(err, entry) {

                if(!entry)
                {
                    //Authentication Failed
                    res.json({ verification: false, message: 'Validation Failed' });
                    console.log("Log :" + colors.red("Validation Failed")); 
                }
                else
                {
                    //Check Id Entry Key Is Not Used
                    if(entry.status == false)
                    {   
                        
                        //Check Ticket Status Before
                        Ticket.findOne({ ticketUserSession: userSessionKey, ticketEventId: ticketEventId}, function(err, ticket) {

                            //If No Ticket
                            if(!ticket)
                            {
                                res.json({ verification: false, message: 'Ticket Dosent Exist' });
                                console.log("Log :" + colors.red("No Ticket Exists For User")); 
                            }
                            else
                            {
                                //If The Status Is Marked As Banned Or Cancelled
                                if(ticket.ticketStatus == "Banned" || ticket.ticketStatus == "Canceled")
                                {
                                    res.json({ verification: false, message: 'Ticket Banned' });
                                    console.log("Log :" + colors.red("Ticket Banned")); 
                                }
                                else
                                {
                                    //Update The Ticket To Checked In
                                    Ticket.update({ ticketUserSession: userSessionKey, ticketStatus: "Not Checked In", ticketEventId: ticketEventId }, {$set: { "ticketStatus": "Checked In" }}, function(err)  { 
                            
                                        if (!err) {
                                            console.log("Log :" + colors.red("Ticket Checked In")); 

                                            //Count All Checked In Users & Update Count
                                            Ticket.count({ ticketEventId: ticketEventId,  ticketStatus: "Checked In"}, function(err, count)  { 
                    
                                                //Update The Evnet Information With The New Ticket
                                                Event.update({ eventPublicId: ticketEventId}, {$set: { "eventCheckedInCount": count }}, function(err, tickets)  { 

                                                    res.json({ verification: true, message: 'Ticket Checked' });
                                                });
                                            });
                                        }
                                        else {
                                            console.log("Ticket Not Checked In");
                                            res.json({ verification: false, message: 'Session Key / Status Fail' });
                                            console.log("Log :" + colors.green("Ticket Not Checked In")); 
                                        }
                                    });

                                    //Disable Entry Key After Uuser Chacked In
                                    EntryKeys.update({ entryKey: entryKey}, {$set: { "status": "true" }}, function(err, entryx)  { 
                            
                                        console.log("Entry Key Used");
                                        console.log("Log :" + colors.red("Entry Key Used")); 
                                    });   
                                }
                            }
                        });    
                    }
                    else
                    {
                        res.json({ verification: false, message: 'Ticket Used' });
                        console.log("Log :" + colors.green("Ticket Used")); 
                    }
                } 
            });
        }
        else
        {
            res.json({ verification: false, message: 'No Event For EventId' });
        }
    });
});

//Register & Activation Generation
app.post('/createUserUrl' , function(req, res) {
    
    //Create User Object To Store Registration Info
    var firstName = rreq.query.firstName;
    var lastName = req.query.lastName;
    var email = req.query.username;
    var password = req.query.password;

    
    //Check If Email Exists In NFCVT Database
    User.findOne({ username: email}, function(err, user) {

        if(user != null)
        {   
            //If Email Exists Retrun False Status & Message
            res.json({ message: 'Email Exists', status: false}); 
        }
        else
        {
            //If Email Does Not Exists Begin Registration Process

            //Generate Randome Code For Activation
            var code = getRandomInt(1,1000000);

            //Combine The User Details For Session Key
            var combined = firstName+lastName+email;

            //Encrypt Session Key
            var sessionKey = encrypt(combined);

            //Encrypt Password
            var password = encrypt(req.body.password);

            //Create MongoDb User Object
            var user = new User ({
                firstName: firstName,
                lastName: lastName,
                username: email,
                password: encrypt(req.body.password),
                sessionKey: sessionKey,
                activationKey: code,
                activation: false
            });

            //Save User To Database
            user.save(function(err) {
            
                //Check Db Status
                if(err) {

                    res.json({ message: 'Cant Registering', status: false }); 
                }
                else {

                    //Send Email With The Code
                    sendgrid.send({
                        
                        to:       req.body.username,
                        from:     'NFCVT',
                        subject:  'NFCVT Email Verification',
                        text:     'Hi ' +req.body.firstName+ ', \n Your activation code \n \n' +user.activationKey+ '\n \n NFCVT Team'

                    }, function(err, json) 

                    {
                        if(err) 
                        { 
                            //If Error Remove User
                            User.remove({ firstName: req.body.firstName, lastName: req.body.lastName, username: email },function(err) {

                                if(err) {

                                    //If No Error Pass
                                    res.json({ message: 'Try Again', status: false });    
                                }
                                else
                                {
                                    //If No Error Pass
                                    res.json({ message: 'Error', status: true }); 
                                }
                            });

                        }
                        else
                        {
                            //If No Error Pass
                            res.json({ message: 'Registered', status: true }); 
                        }
                        
                    });
                }
            
            });
        }
    });  
});                

//Android Module Get All Tickets That Bellng To User
app.get('/getAllMyTicketsUrl', function(req, res) {

    //Sample Url : /getAllMyTicketsUrl?sessionKey=

    //Retrieve The Url Variable
    var sessionKey = req.query.sessionKey;

    //Find Tickets Belonging To User
    Ticket.find({ ticketUserSession: sessionKey}, function(err, tickets)  {

        //Json Resonse       
        res.json(tickets);

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
console.log("\n==========================================");
console.log("------------- " +colors.blue("NFCVT SERVER") + " ---------------");
console.log("==========================================\n");

console.log("Server Status : " + colors.green("Running"));
console.log("Server Port : " + colors.green(usePort));

console.log("\n==========================================");
console.log("------------- " +colors.blue("SERVER LOG") + " ---------------");
console.log("==========================================\n");
