"use strict";

var http = require('http');

var moment = require("moment");

var uuid = require("uuid");
var url;


exports.read = function(req,res){

	/*switch (req.params.type) {
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
	}*/

	if(!req.params.type) {
		//getHomeData(req);
		res.render("index")
	} else {
		getCategoryData(req,res);
	}
	
}

function getCategoryData(req,res) {
	var model = req.model;
	//var newsObj = {};
	var str = new RegExp(req.params.type.replace(/\s+/g,"\\s+"), "gi");  
	model.news.find({category: { $regex: str, $options: 'i' } ,deleted: false, verified: true},{_id:0})
	.limit(10)
	.sort('-pubDate')
	.exec(function(err,data){
		if(err) throw err;
		if(data) {
			//newsObj.category = data; db.inventory.find( { price: { $not: { $gt: 1.99 } } } )
			var firstLetter = req.params.type.substring(0,1).toUpperCase();
			var sec = req.params.type.substring(1)
			var ans = firstLetter + sec;
			
			var reg = new RegExp(ans.replace(/\s+/g,"\\s+"), "gi");
			
			model.news.find({category:{$not: reg},deleted:false,verified:true})
			.sort('-pubDate')
			.limit(12)
			.exec(function(err,other){
				if(err) throw err;
				//newsObj.other = other;
				//res.json(newsObj);
				console.log(other);
				res.render('categories',{news: data, other: other,type: req.params.type,moment: moment});
			})	
		}	else {
			res.render("404");
		}
	})
}

exports.renderSingle = function(req,res){
	var model = req.model;
	model.news.findOne({id: req.params.id},function(err,data){		

		model.news.find({category: data.category,deleted:false,verified:true},
			{_id:0,title:1,link:1,main_image_link:1,path:1},function(err,list){
			if(err) throw err;
			//data.related_articles = list;
			//res.json(data);
			res.render("single-post",{news: data,related_articles: list,moment: moment});
		}).limit(8)

	})
	
}

exports.renderSharePage = function(req,res){
	var s = req.url;
	var toArr = s.split("/")
	var to = "/news/" + toArr[1] + toArr[2];
	res.redirect(to)
	/*var model = req.model;
	model.news.findOne({id: req.params.id},function(err,data){
		var idShare = req.url.split('/')
		if(idShare[1] === 'share') {
			res.render("single-post",{news: data});
		} else {
			res.render("share-single-post",{news: data});
		}
		
	})*/
	
}

/*** for Ajax Pulling ***/

exports.readAll = function(req,res){
	var model = req.model;
	model.news.find({verified:true,deleted: false})
	.limit(15)
	.sort("-pubDate")
	.exec(function(err,data){
		if(err) throw err;
		res.json(data);
	})
}



exports.readSinglePost = function(req,res){
	console.log(req.query)
	var model = req.model;
	model.news.findOne({id: req.query.id,verified: true,deleted: false}).exec(function(err,data){
		if(err) throw err;
		if(data){
			data.views += 1;
			data.save(function(err,info){});
			model.news.find({category: data.category,deleted:false,verified:true},
				{_id:0,title:1,link:1,main_image_link:1,path:1},function(err,list){
				if(err) throw err;
				data.related_articles = list;
				res.json(data);
			}).limit(8)
		} else {
			res.send({})
		}
		
	})
}

exports.comments = function(req,res){
	var model = req.model;
	console.log(req.body)
	model.news.findById(req.body.id)
	.exec(function(err,data){
		if(err) throw err;
		if(data){
			var comObj = {
				name: req.body.name,
				message: req.body.message,
				comment_id: uuid.v1(),
				date: req.body.date
			}

			data.comments.push(comObj);
			data.save(function(err,info){
				if(err) throw err;
				console.log("comment saved!")
			})
			res.send(comObj)
		}
	})
}

exports.readCategoryPosts = function(req,res){
	var model = req.model;
	var newsObj = {};
	model.news.find({category: req.query.category,deleted: false, verified: true},{_id:0})
	.limit(10)
	.sort('-pubDate')
	.exec(function(err,data){
		if(err) throw err;
		newsObj.category = data
		model.news.find({deleted:false,verified:true})
		.sort('-pubDate')
		.limit(10)
		.exec(function(err,other){
			if(err) throw err;
			newsObj.other = other;
			res.json(newsObj);
		})		
	})
}

exports.readFooterNews = function(req,res){
	var model = req.model
	model.news.find({deleted:false,verified:true})
	.limit(4)
	.sort('-pubDate')
	.exec(function(err,data){
		if(err) throw err;
		res.json(data);
	})
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