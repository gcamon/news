"use strict";

var http = require('http');

var uuid = require("uuid");
var url;


exports.read = function(req,res){

	switch (req.params.type) {
		case "politics":
			res.render('categories');
		break;

		case "business":
			res.render('categories');
		break;

		case "sports":
			res.render('categories');
		break;

		case "lifestyle":
			res.render('categories');
		break;

		case "entertainment":
			res.render('categories');
		break;

		case "technology":
			res.render('categories');
		break;

		case "world":
			res.render('categories');
		break;

		case "career":
			res.render('categories');
		break;

		default:
		  res.render('index');
		break
	}
	
}

exports.readSingle = function(req,res){
	res.render("single-post")
}

exports.feeds = function(req,resp){
	var feedPath = "/";
	if(req.query.url) {
		url = req.query.url.split("/");
		for(var i = 3; i < url.length; i++){
			if(i < url.length - 1) {
				feedPath += url[i] + "/";
			} else {
				feedPath += url[i];
			}
		}
	}

	var options = {
	  host: url[2] || "",
	  path: feedPath || ""
	};

	var req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    //console.log('BODY: ' + body);
	    resp.send(body)
	    // ...and/or process the entire body here.
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
}