"use strict";
var express = require('express'),      
  db = require('./app/server/model'),
  config = require('./config'),    
  route = require('./app/server/routes'),
  basicAuth = require("./app/server/controllers/basicAuth.server.controller"),
  //loginRoute = require('./login'),  
  app = express(),
  http = require('http').Server(app),
  model = db(),
 
  port = process.env.PORT || 3002;

config.configuration(app,model);
basicAuth(model,app);
route(app);


//adminRoute(config)


http.listen(port,function(){
  console.log('listening on *: ' + port);
});







var a = "ede".replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
var b = "ede".replace(/\s+/g, '');

console.log(a);