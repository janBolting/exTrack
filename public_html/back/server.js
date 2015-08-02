// Required Modules
var express = require("express");
// var morgan = require("morgan");
// var bodyParser = require("body-parser");
// var jwt = require("jsonwebtoken");
// var mongoose = require("mongoose")
var app = express();

var port = process.env.PORT || 3001;
// var User = require('./models/User');

// Connect to DB
// mongoose.connect('mongodb://localhost/test');

//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());
//app.use(morgan("dev"));
app.use(express.static("./front/app"));
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
*/

app.get("/userdata/*", function (req, res) {
    var user = getURLSegment(req.url, 2);
    res.sendFile("./data/" + user + ".json", { root : __dirname});
});

process.on('uncaughtException', function (err) {
    console.log(err); 
});

// Start Server
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});

var getURLSegment = function (url, index) {
   return url.replace(/^https?:\/\//, '').split('/')[index]; 
}