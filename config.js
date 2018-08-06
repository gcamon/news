'use strict';
//require('dotenv').config();
var express = require('express');
var path = require("path");
var multer = require('multer');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var flash = require('connect-flash');
//var cookieParser = require("cookie-parser");

//var ExpressPeerServer = require('peer').ExpressPeerServer;
 


var configuration = function (app,model) {
  //config
  
  var storeDB = process.env.MONGODB_ADDON_URI || "mongodb://127.0.0.1:27017/wobinews";
  var store = new MongoDBStore(
    {
      uri: storeDB,
      collection: 'mySessions'
  });

 	store.on('error', function(error) {
	  assert.ifError(error);
	  assert.ok(false);
	});

	app.use('/assets',express.static(__dirname + '/public'));
	//middleware
	app.use(session({
	  secret: 'keyboard cat',
	  store: store,
	  resave: true,	  
	  saveUninitialized: true,
	  cookie: {
	  	httpOnly: true, 
	  	//maxAge: 3600000 * 3, // 3 hours
	  	path: "/"
	  } //secure: true will be set on the cookie when i this site is on https
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());		
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(multer({dest: './app/server/controllers/media'}).any());
	
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');

	app.use(function(req, res, next) {
		console.log(req.host, req.url)
    res.setHeader("Access-Control-Allow-Origin", "*");
    req.model = model;
    return next();
  });

	passport.serializeUser(function(user, done) {   
    	done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		model.admin.findById(id, function(err, user) {		
		  done(err, user);	
		});
	})

	//app.use('/',router);

}

module.exports = {
  configuration: configuration,
  router: router,
  passport: passport	
}