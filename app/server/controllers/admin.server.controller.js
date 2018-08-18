
var uuid = require("uuid");
//var model = require("../model")();

exports.summernote = function(req,res){
	if(req.user){
		res.render("summernote",{user: req.user})
	} else {
		res.redirect("/admin/login")
	}
}

exports.summernoteEdit = function(req,res){
	if(req.user){
		res.render("post-edit",{user: req.user})
	} else {
		res.redirect("/admin/login")
	}
}

exports.bootstrapnote = function(req,res){
	if(req.user){
		res.render("bootstrapnote",{user: req.user})
	} else {
		res.redirect("/admin/login")
	}
}

exports.allMedia = function(req,res){
	if(req.user){
		res.render("media",{user: req.user});
	} else {
		res.end("unauthorized access!")
	}
}

exports.allMediaContent = function(req,res){
	if(req.user){
		var model = req.model;
		model.files.find({},function(err,files){
			if(err) throw err;
			res.json(files);
		}).limit(200);
	} else {
		res.end("unauthorized access!");
	}
}


exports.readMediaFile = function(req,res){
	if(req.user){
		var file = __dirname + "/media/" + req.params.file;
    res.download(file); 
	} else {
		res.end("unauthorized access!");
	}
}


/*
router.get("/download/profile_pic/:pic_id", function(req,res){        
    if(req.params.pic_id === "nopic") {    
                    
      var nopic = __dirname + "/uploads/2d5383cfc31897aafbe6b4cdfbd30bf1"
      res.download(nopic);
    
    } else {
        var file = __dirname + "/uploads/" + req.params.pic_id;
        res.download(file); // Set disposition and send it.
    }
  });
*/

exports.uploadFile = function(req,res){
	if(req.user){
		var model = req.model;
		var fileData;
		var fileList = [];
		if(req.files){
			for(var i = 0;i < req.files.length; i++){
				if(req.files[i]){
					var fileObj = {
						type:"image",
						date: + new Date(),
						name: req.files[i].originalname,
						size: req.files[i].size,
						mimetype: req.files[i].mimetype,
						filename: req.files[i].filename,
						dest: req.files[i].path,
						path: "/content/media/" + req.files[i].filename,
						external_link: req.host + "/content/media/" + req.files[i].filename
					}
					console.log(fileObj);
					fileList.push(fileObj);
					fileData = new model.files(fileObj)
					fileData.save(function(err,info){
						if(err) throw err;
						console.log("details save!")
					})
				}
			}
			res.json(fileList)
		} else {
			res.send([])
		}
		
		
	} else {
		res.end("unauthorized access!")
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
		req.body.share = "/share/" + newsId + "/" + inviteLink;
		req.body.path = "/news/" + newsId + "/" + inviteLink;
		req.body.link = (req.host == 'localhost') ? (req.host + ":3002" + "/news/" + newsId + "/" + inviteLink) : (req.host + "/news/" + newsId + "/" + inviteLink);



		var post = new model.news(req.body);
		post.save(function(err,info){
			if(err) {
				throw err;
				res.send({status: false,message: "Something went wrong!"});
			} else {
				res.json({status: true, message: "Success! Post saved for verification"});
			}
		})
		
	} else {
		res.send({status: false,message: "User session not recognised!"})
	}

}


exports.readUnverified = function(req,res){
	if(req.user){
		var model = req.model;
		model.news.find({deleted: false,verified: false}) // return to normal verified: false
		.sort('-date')
		.exec(function(err,data){
			if(err) throw err;
			res.json(data)
		})
	} else {
		res.end("unauthorized access!")
	}
}

exports.readVerified = function(req,res){
	if(req.user){
		var model = req.model;
		model.news.find({deleted: false, verified: true})
		.limit(100)
		.sort('-pubDate')
		.exec(function(err,data){
			if(err) throw err;
			res.json(data)
		})
	} else {
		res.end("unauthorized access!");
	}
}

exports.updatetoverify = function(req,res){
	if(req.user){
		console.log(req.body)
		var model = req.model;
		model.news.findOne({deleted: false, verified: false, id: req.body.id}) 
		.exec(function(err,data){
			if(err) throw err;
			if(data){
				data.status = req.body.status;
				data.verified = true;
				data.pubDate = req.body.pubDate;
				data.save(function(err,info){
					if(err) throw err;
					console.log("news published!")
					res.json({message: "News published successfully!",status:true})
				})
			} else {
				res.json({message: "Error occured! News not published. Please make sure this news does exist as unverified news",status:false})
			}
		})
	} else {
		res.end("unauthorized access!")
	}
	
}

exports.deleteunverify = function(req,res){
	if(req.user){
		var model = req.model;
		model.news.findOne({deleted: false, verified: false,id: req.query.id})
		.exec(function(err,data){
			if(err) throw err;
			if(data){
				data.deleted = true;
				data.save(function(err,info){
					if(err) throw err;
					console.log("news deleted")
					res.json({message: "News deleted successfully",status:true})
				})
			} else {
				res.json({message: "Error occured! News not deleted. Please make sure this news ID does exist as unverified news content",status:false})
			}
		})
	} else {
		res.end("unauthorized access!")
	}
}

exports.updatePost = function(req,res){
	if(req.user) {
		var model = req.model;
		model.news.findById(req.body._id)
		.exec(function(err,data){
			if(err) throw err;
			if(data){
				data.category = req.body.category;
				data.title = req.body.title;
				data.main_image_link = req.body.main_image_link;
				data.article = req.body.article;
				data.date = req.body.date;
				data.save(function(err,info){
					if(err) throw err;
					console.log("post edited successfully!");
					res.json({status:true,message:"Edit saved and queued for verification"});
				})
			} else {
				res.json({status:false,message:"Error occured while updating post.Please try again"});
			}
		})
	} else {
		res.end("unauthorized access!")
	}
}

exports.deletePost = function(req,res){
	if(req.user){
		var model = req.model;		
		model.news.findById(req.query.id)
		.exec(function(err,data){
			if(err) throw err;
			if(data) {
				data.deleted = true;
				data.save(function(err,info){
					if(err) throw err;
					console.log("post deleted from general view")
				})
				res.json({status: true, message: "Post deleted successfully!"})
			} else {
				res.json({status:false,message: "Oops,post not found and nothing was deleted!"})
			}
		})
		
	} else {
		res.end("Unauthorized access!")
	}
	
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




