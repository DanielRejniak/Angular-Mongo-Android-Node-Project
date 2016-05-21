//Set The Modules To Be Used
var express = require('express');
var app = express();

//Get Event Info For Dashboard
app.get('/getPublicEventInfo', function(req, res) {

    Event.find({ eventPublic: "true", eventActivation: true}, function(err, events)  {   
    res.json(events);

    });

});