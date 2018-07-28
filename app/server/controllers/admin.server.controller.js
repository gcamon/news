
var uuid = require("uuid");
//var model = require("../model")();

exports.summernote = function(req,res){
	if(req.user){
		res.render("summernote",{user: req.user})
	} else {
		res.redirect("/admin/login")
	}
}

exports.bootstrapnote = function(req,res){
	if(req.user){
		res.render("bootstrapnote")
	} else {
		res.redirect("/admin/login")
	}
}

exports.getPost = function(req,res){
	if(req.user){
		req.model.news.findById(req.query._id)
		.exec(function(err,data){
			if(err) throw err;
			res.json(data);
		})
	} else {
		res.send({})
	}
}

exports.newPost = function(req,res){	
	console.log(req.user)
	if(req.user) {
		var model = req.model;	
		var newsId = genHash();
		var inviteLink = createNewsLink(req.body.title);
		req.body.id = newsId;
		req.body.reporter_name = req.user.firstname + " " + req.user.lastname;
		req.body.reporter_id = req.user._id.toString();
		req.body.reporter_pic_url = req.user.profile_pic_url;
		req.body.views = 0;
		req.body.verified = false;
		req.body.deleted = false;
		req.body.path = "/news/" + newsId + "/" + inviteLink;
		req.body.link = (req.host == 'localhost') ? (req.host + ":3002" + "/news/" + newsId + "/" + inviteLink) : (req.host + "/news/" + newsId + "/" + inviteLink);

		console.log(req.body);

		var post = new model.news(req.body);
		post.save(function(err,info){
			if(err) {
				throw err;
				res.send({status: false,message: "Something went wrong!"})
			} else {
				res.json({status: true, message: "Success! Post saved for verification"});
			}
		})
		
	} else {
		res.send({status: false,message: "User session not recognised!"})
	}

}

exports.updatePost = function(req,res){
	res.json({})
}

exports.deletePost = function(req,res){
	res.json({})
}


exports.getPostList = function(req,res) {
	if(req.user){
		req.model.news.find({})
		.exec(function(err,data){
			if(err) throw err;
			res.json(data);
		})
	} else {
		res.send([])
	}
}

exports.editPost = function(req,res) {

}

function genHash() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function createNewsLink(title){
	var str = "";
	if(title) {
		var spt = title.split(" ");
		for(var i = 0; i < spt.length; i++){
			str += spt[i] + "-";
		}
	}

	var tm = str.slice(0, -1)

	console.log(tm)
	return tm;
}




