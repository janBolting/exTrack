// Required Modules
var express = require("express");
var session = require('express-session')
var bodyParser = require("body-parser");
// var morgan = require("morgan");
// var bodyParser = require("body-parser");
// var jwt = require("jsonwebtoken");
// var mongoose = require("mongoose")
var app = express();
var fs = require('fs');

var port = process.env.PORT || 3001;
// var User = require('./models/User');

// Authentification ->
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
        function (username, password, done) {
            //console.log(username);
            user = 'bob';
            if (!(username === 'bob')) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!(password === 'pwd')) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user, {message: 'Authenticated'});
        }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// var mongoose = require('mongoose');
// var dbConfig = require('./database.js');
// mongoose.connect(dbConfig.url);

// <- Authentication
app.use(express.static("./front/app"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
  app.use(passport.session());

app.get("/userdata/*", function (req, res) {
    var user = getURLSegment(req.url, 2);
    var fname = "./data/" + user + ".json";
    res.sendfile(fname, {root: __dirname});
});

app.post("/userdata/*", function (req, res) {
    var user = getURLSegment(req.url, 2);
    var jsonstring = JSON.stringify(req.body, null, "\t");
    res.end(jsonstring);
    var fname = "./data/" + user + ".json";
    fs.writeFile(fname, jsonstring, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("File received from client was saved as " + fname);
    });
});

app.post('/login', function handleLocalAuthentication(req, res, next) {

    //console.log("Request body: " + JSON.stringify(req.body, null, "\t"));
    
    passport.authenticate('local', function (err, user, info) {
        console.log("Response: " + JSON.stringify(info, null, "\t"));
        if (err){
            return next(err); 
        }
        if (!user) {
            return res.json(403, {
                message: info
            });
        }

        // Manually establish the session...
        req.login(user, function (err) {
            if (err){
                return next(err);
            }
            return res.json({
                message: info
            });
        }
                );
    })(req, res, next);
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