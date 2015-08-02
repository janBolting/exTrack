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
app.use(express.static("/data"));
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
*/

app.get("/", function (req, res) {
    res.sendFile("./front/app/index.html");
});

app.get("/alluserdata", function (req, res) {
    res.sendFile("/data/users.json");
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});